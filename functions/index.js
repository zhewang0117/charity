const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp();

// Configuration - in production, store these in Firebase config
const WEATHER_API_KEY = "fee06c2441e7556141d3d254a3a5736b";
const EMAIL_API_KEY = functions.config().email?.api_key || "demo-key";

// Utility functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const logActivity = async (action, userId, metadata = {}) => {
  try {
    const db = admin.firestore();
    await db.collection('activityLogs').add({
      action,
      userId,
      metadata,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// =============================================================================
// HTTP CALLABLE FUNCTIONS - Client-Server Communication
// =============================================================================

// Basic echo function for testing connectivity
exports.echo = functions.https.onCall((data, context) => {
  const message = data.message || 'Hello from Cloud Functions';
  const userId = context.auth ? context.auth.uid : 'anonymous';
  
  // Log the activity
  logActivity('echo_called', userId, { message });
  
  return { 
    message: `Echo: ${message}`,
    timestamp: new Date().toISOString(),
    userId: userId
  };
});

// Enhanced weather service with error handling and logging
exports.getWeatherData = functions.https.onCall(async (data, context) => {
  const userId = context.auth ? context.auth.uid : 'anonymous';
  
  try {
    let url;
    let queryType;
    
    if (data.lat && data.lon) {
      // Get weather by coordinates
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${WEATHER_API_KEY}`;
      queryType = 'coordinates';
    } else if (data.city) {
      // Get weather by city name
      url = `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=${WEATHER_API_KEY}`;
      queryType = 'city';
    } else {
      await logActivity('weather_request_failed', userId, { reason: 'missing_parameters' });
      return { success: false, message: 'Either coordinates (lat, lon) or city name is required' };
    }
    
    const response = await axios.get(url);
    
    if (response.status === 200) {
      // Log successful weather request
      await logActivity('weather_request_success', userId, { 
        queryType,
        city: response.data.name,
        country: response.data.sys.country 
      });
      
      return {
        success: true,
        ...response.data,
        requestTime: new Date().toISOString()
      };
    } else {
      await logActivity('weather_request_failed', userId, { 
        reason: 'api_error',
        status: response.status 
      });
      return { success: false, message: 'Weather API request failed' };
    }
  } catch (error) {
    console.error('Weather API error:', error);
    
    await logActivity('weather_request_error', userId, { 
      error: error.message,
      queryType: data.lat ? 'coordinates' : 'city'
    });
    
    if (error.response) {
      // API returned an error
      if (error.response.status === 404) {
        return { success: false, message: 'City not found' };
      } else if (error.response.status === 401) {
        return { success: false, message: 'Invalid API key' };
      } else {
        return { success: false, message: 'Weather service temporarily unavailable' };
      }
    } else {
      // Network error or other issue
      return { success: false, message: 'Failed to fetch weather data' };
    }
  }
});

// Volunteer signup with validation and notification
exports.submitVolunteerSignup = functions.https.onCall(async (data, context) => {
  const userId = context.auth ? context.auth.uid : null;
  
  try {
    const { name, email, activityId, message, phoneNumber } = data;
    
    // Validation
    if (!name || !email || !activityId) {
      await logActivity('volunteer_signup_failed', userId, { reason: 'missing_fields' });
      return { success: false, message: 'Missing required fields: name, email, and activityId' };
    }
    
    if (!validateEmail(email)) {
      await logActivity('volunteer_signup_failed', userId, { reason: 'invalid_email' });
      return { success: false, message: 'Invalid email format' };
    }
    
    const db = admin.firestore();
    
    // Check if already signed up for this activity
    const existingSignup = await db.collection('volunteerSignups')
      .where('email', '==', email)
      .where('activityId', '==', activityId)
      .get();
    
    if (!existingSignup.empty) {
      await logActivity('volunteer_signup_duplicate', userId, { email, activityId });
      return { success: false, message: 'You have already signed up for this activity' };
    }
    
    // Create signup record
    const signupData = {
      name,
      email,
      activityId,
      message: message || null,
      phoneNumber: phoneNumber || null,
      userId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false,
      status: 'pending',
      confirmationToken: generateSecureToken()
    };
    
    const docRef = await db.collection('volunteerSignups').add(signupData);
    
    // Log successful signup
    await logActivity('volunteer_signup_success', userId, { 
      signupId: docRef.id,
      activityId,
      email 
    });
    
    // Trigger notification (this would be handled by another function)
    await db.collection('notifications').add({
      type: 'volunteer_signup',
      signupId: docRef.id,
      activityId,
      processed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      id: docRef.id,
      message: 'Signup successful! You will receive a confirmation email soon.' 
    };
    
  } catch (err) {
    console.error('submitVolunteerSignup error', err);
    await logActivity('volunteer_signup_error', userId, { error: err.message });
    return { success: false, message: 'Server error occurred. Please try again later.' };
  }
});

// Contact form submission with spam protection
exports.submitContactForm = functions.https.onCall(async (data, context) => {
  const userId = context.auth ? context.auth.uid : 'anonymous';
  const clientIP = context.rawRequest?.ip || 'unknown';
  
  try {
    const { name, email, subject, message, honeypot } = data;
    
    // Honeypot spam protection
    if (honeypot && honeypot.trim() !== '') {
      await logActivity('contact_form_spam', userId, { clientIP });
      return { success: false, message: 'Spam detected' };
    }
    
    // Validation
    if (!name || !email || !subject || !message) {
      return { success: false, message: 'All fields are required' };
    }
    
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }
    
    if (message.length < 10) {
      return { success: false, message: 'Message must be at least 10 characters long' };
    }
    
    const db = admin.firestore();
    
    // Rate limiting - check recent submissions from same IP
    const recentSubmissions = await db.collection('contactForms')
      .where('clientIP', '==', clientIP)
      .where('createdAt', '>', new Date(Date.now() - 60000)) // Last minute
      .get();
    
    if (recentSubmissions.size >= 3) {
      await logActivity('contact_form_rate_limited', userId, { clientIP });
      return { success: false, message: 'Too many submissions. Please wait before submitting again.' };
    }
    
    // Store contact form submission
    const contactData = {
      name,
      email,
      subject,
      message,
      userId,
      clientIP,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false,
      status: 'new'
    };
    
    const docRef = await db.collection('contactForms').add(contactData);
    
    await logActivity('contact_form_submitted', userId, { 
      formId: docRef.id,
      subject 
    });
    
    return { 
      success: true, 
      id: docRef.id,
      message: 'Thank you for your message. We will get back to you soon!' 
    };
    
  } catch (error) {
    console.error('Contact form error:', error);
    await logActivity('contact_form_error', userId, { error: error.message });
    return { success: false, message: 'Server error occurred. Please try again later.' };
  }
});

// User profile management
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  // Require authentication
  if (!context.auth) {
    return { success: false, message: 'Authentication required' };
  }
  
  const userId = context.auth.uid;
  
  try {
    const { displayName, phoneNumber, preferences, bio } = data;
    const db = admin.firestore();
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (displayName) updateData.displayName = displayName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (preferences) updateData.preferences = preferences;
    if (bio) updateData.bio = bio;
    
    await db.collection('users').doc(userId).update(updateData);
    
    await logActivity('profile_updated', userId, { 
      fields: Object.keys(updateData).filter(key => key !== 'updatedAt')
    });
    
    return { success: true, message: 'Profile updated successfully' };
    
  } catch (error) {
    console.error('Profile update error:', error);
    await logActivity('profile_update_error', userId, { error: error.message });
    return { success: false, message: 'Failed to update profile' };
  }
});

// =============================================================================
// HTTP REQUEST FUNCTIONS - RESTful API Endpoints
// =============================================================================

// Public API endpoint for health check
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      firestore: 'operational',
      authentication: 'operational',
      weather_api: 'operational'
    }
  };
  
  res.json(healthData);
});

// Public statistics API
exports.getPublicStats = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  
  try {
    const db = admin.firestore();
    
    // Get public statistics
    const [volunteersSnapshot, activitiesSnapshot, signupsSnapshot] = await Promise.all([
      db.collection('users').where('role', '==', 'volunteer').get(),
      db.collection('activities').where('status', '==', 'active').get(),
      db.collection('volunteerSignups').where('status', '==', 'confirmed').get()
    ]);
    
    const stats = {
      totalVolunteers: volunteersSnapshot.size,
      activeActivities: activitiesSnapshot.size,
      completedSignups: signupsSnapshot.size,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// =============================================================================
// BACKGROUND TRIGGER FUNCTIONS - Event-Driven Processing
// =============================================================================

// Enhanced user creation with welcome workflow
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const db = admin.firestore();
    
    // Create user profile with enhanced data
    const profile = {
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 'immigrant', // default role
      status: 'active',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        language: 'en'
      },
      stats: {
        loginCount: 0,
        lastLoginAt: null,
        activitiesJoined: 0
      }
    };
    
    await db.collection('users').doc(user.uid).set(profile);
    
    // Create welcome notification
    await db.collection('notifications').add({
      userId: user.uid,
      type: 'welcome',
      title: 'Welcome to CareNexus!',
      message: 'Thank you for joining our community. Explore activities and connect with others.',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Log the user creation
    await logActivity('user_created', user.uid, {
      email: user.email,
      provider: user.providerData[0]?.providerId || 'unknown'
    });
    
    console.log(`User profile created for ${user.uid}`);
    
  } catch (error) {
    console.error('Error in onUserCreate:', error);
  }
});

// =============================================================================
// SCHEDULED FUNCTIONS - Automated Tasks
// =============================================================================

// Daily cleanup and maintenance
exports.dailyMaintenance = functions.pubsub
  .schedule('0 2 * * *') // 2 AM UTC daily
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      console.log('Starting daily maintenance at', now.toISOString());
      
      // Clean up old activity logs (keep only last 7 days)
      const oldLogs = await db.collection('activityLogs')
        .where('timestamp', '<', oneWeekAgo)
        .get();
      
      const batch = db.batch();
      let deletedLogs = 0;
      
      oldLogs.forEach(doc => {
        batch.delete(doc.ref);
        deletedLogs++;
      });
      
      if (deletedLogs > 0) {
        await batch.commit();
        console.log(`Deleted ${deletedLogs} old activity logs`);
      }
      
      // Update daily statistics
      await db.collection('systemStats').doc('daily').set({
        lastMaintenanceRun: admin.firestore.FieldValue.serverTimestamp(),
        deletedLogs: deletedLogs
      }, { merge: true });
      
      await logActivity('daily_maintenance_completed', 'system', { deletedLogs });
      
      console.log('Daily maintenance completed successfully');
      
    } catch (error) {
      console.error('Error in daily maintenance:', error);
      await logActivity('daily_maintenance_failed', 'system', { error: error.message });
    }
  });

// =============================================================================
// EMAIL FUNCTIONS - Email Service Integration
// =============================================================================

// Simple email sending function
exports.sendEmail = functions.https.onCall(async (data, context) => {
  try {
    const { to, subject, text } = data;
    
    // 验证必填字段
    if (!to || !subject || !text) {
      return { success: false, message: 'Missing required fields: to, subject, text' };
    }

    // 验证邮箱格式
    if (!validateEmail(to)) {
      return { success: false, message: 'Invalid email format' };
    }

    const db = admin.firestore();
    const userId = context.auth?.uid || 'anonymous';
    
    // 创建邮件记录
    const emailData = {
      to,
      subject,
      text,
      status: 'sent', // 简化处理，实际应该是 'queued' 然后处理
      sentBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('emails').add(emailData);

    // 记录活动日志
    await logActivity('email_sent', userId, {
      emailId: docRef.id,
      to,
      subject
    });

    // 在实际应用中，这里应该调用真实的邮件发送服务
    // 比如 SendGrid, AWS SES, 或者 nodemailer
    console.log(`Email sent simulation: To: ${to}, Subject: ${subject}`);

    return {
      success: true,
      id: docRef.id,
      message: 'Email sent successfully! (Note: This is a simulation for demo purposes)'
    };

  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, message: 'Failed to send email: ' + error.message };
  }
});

// =============================================================================
// ADVANCED FEATURES - Extended Functionality
// =============================================================================

// Callable function: book appointment with calendar constraints
exports.bookAppointment = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    
    // 验证必填字段
    const { serviceId, serviceName, date, time, patientName, email, phone } = data;
    if (!serviceId || !date || !time || !patientName || !email || !phone) {
      return { success: false, message: 'Missing required fields' };
    }

    // 检查日期有效性（不能是过去的日期）
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return { success: false, message: 'Cannot book appointments in the past' };
    }

    // 检查工作日限制（周一到周五）
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { success: false, message: 'Appointments are only available on weekdays' };
    }

    // 检查时间冲突
    const conflictQuery = await db.collection('appointments')
      .where('date', '==', date)
      .where('time', '==', time)
      .where('serviceId', '==', serviceId)
      .where('status', '!=', 'cancelled')
      .get();

    if (!conflictQuery.empty) {
      return { success: false, message: 'This time slot is already booked' };
    }

    // 创建预约
    const docRef = await db.collection('appointments').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await logActivity('appointment_booked', context.auth?.uid || 'anonymous', {
      appointmentId: docRef.id,
      serviceName,
      date,
      time
    });

    return { success: true, id: docRef.id, message: 'Appointment booked successfully' };
  } catch (error) {
    console.error('Book appointment error:', error);
    return { success: false, message: 'Failed to book appointment' };
  }
});

// Callable function: bulk email sending
exports.sendBulkEmail = functions.https.onCall(async (data, context) => {
  try {
    const { recipients, subject, message, template } = data;
    
    if (!recipients || !recipients.length || !subject || !message) {
      return { success: false, message: 'Missing required fields' };
    }

    // 限制批量邮件大小
    if (recipients.length > 1000) {
      return { success: false, message: 'Too many recipients. Maximum 1000 allowed.' };
    }

    const db = admin.firestore();
    const batch = db.batch();
    
    // 创建批量邮件记录
    const emailJobRef = db.collection('emailJobs').doc();
    batch.set(emailJobRef, {
      subject,
      message,
      template: template || 'default',
      totalRecipients: recipients.length,
      status: 'pending',
      createdBy: context.auth?.uid || 'anonymous',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 为每个收件人创建邮件记录
    recipients.forEach((recipient, index) => {
      const emailRef = db.collection('emails').doc();
      batch.set(emailRef, {
        jobId: emailJobRef.id,
        to: recipient.email,
        name: recipient.name || recipient.email,
        subject,
        message,
        status: 'queued',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    await logActivity('bulk_email_created', context.auth?.uid || 'anonymous', {
      jobId: emailJobRef.id,
      recipientCount: recipients.length
    });

    return { 
      success: true, 
      jobId: emailJobRef.id,
      message: `Bulk email job created for ${recipients.length} recipients` 
    };
  } catch (error) {
    console.error('Bulk email error:', error);
    return { success: false, message: 'Failed to create bulk email job' };
  }
});

// HTTP function: API access for external services
exports.apiAccess = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const db = admin.firestore();
    
    // API路由处理
    const path = req.path;
    
    if (path === '/stats' && req.method === 'GET') {
      // 获取统计数据
      const appointmentsSnap = await db.collection('appointments').get();
      const usersSnap = await db.collection('users').get();
      const activitiesSnap = await db.collection('volunteerSignups').get();
      const emailJobsSnap = await db.collection('emailJobs').get();
      
      const stats = {
        appointments: appointmentsSnap.size,
        users: usersSnap.size,
        volunteerSignups: activitiesSnap.size,
        emailJobs: emailJobsSnap.size,
        timestamp: new Date().toISOString()
      };
      
      await logActivity('api_stats_accessed', 'api', stats);
      res.json(stats);
      
    } else if (path === '/appointments' && req.method === 'GET') {
      // 获取预约列表
      const snapshot = await db.collection('appointments')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      const appointments = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        appointments.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });
      
      res.json({ appointments, count: appointments.length });
      
    } else if (path === '/dashboard' && req.method === 'GET') {
      // 获取仪表板数据
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // 本月预约统计
      const monthlyAppointments = await db.collection('appointments')
        .where('createdAt', '>=', startOfMonth)
        .get();
      
      // 近期活动统计
      const recentActivities = await db.collection('activityLogs')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();
      
      const activities = [];
      recentActivities.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()?.toISOString()
        });
      });
      
      const dashboardData = {
        monthlyAppointments: monthlyAppointments.size,
        recentActivities: activities,
        lastUpdated: new Date().toISOString()
      };
      
      res.json(dashboardData);
      
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Callable function: AI-powered chat assistant
exports.chatAssistant = functions.https.onCall(async (data, context) => {
  try {
    const { message, conversationId } = data;
    
    if (!message) {
      return { success: false, message: 'Message is required' };
    }

    // 简单的AI响应逻辑（实际应用中可以集成OpenAI或其他AI服务）
    const responses = {
      'hello': 'Hello! How can I help you today?',
      'appointment': 'I can help you book an appointment. What service do you need?',
      'emergency': 'For emergencies, please call 911 or go to your nearest emergency room.',
      'services': 'We offer medical consultation, mental health support, legal consultation, language support, and social services.',
      'hours': 'Our services are available Monday to Friday, 9 AM to 5 PM.',
      'location': 'You can find our locations on the map or contact us for directions.',
      'help': 'I can assist with appointments, service information, emergency contacts, and general questions.'
    };

    const lowerMessage = message.toLowerCase();
    let aiResponse = "I'm here to help! You can ask me about our services, book appointments, or get emergency information.";

    // 简单的关键词匹配
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        aiResponse = response;
        break;
      }
    }

    // 保存对话记录
    const db = admin.firestore();
    const conversationRef = db.collection('conversations').doc(conversationId || db.collection('conversations').doc().id);
    
    await conversationRef.collection('messages').add({
      userMessage: message,
      aiResponse,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: context.auth?.uid || 'anonymous'
    });

    await logActivity('ai_chat_interaction', context.auth?.uid || 'anonymous', {
      conversationId: conversationRef.id,
      messageLength: message.length
    });

    return {
      success: true,
      response: aiResponse,
      conversationId: conversationRef.id
    };
  } catch (error) {
    console.error('Chat assistant error:', error);
    return { success: false, message: 'AI assistant temporarily unavailable' };
  }
});
