const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// HTTP callable function: echo
exports.echo = functions.https.onCall((data, context) => {
  const message = data.message || 'Hello from Cloud Functions';
  return { message: `Echo: ${message}` };
});

// HTTP function: simple API endpoint
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ text: 'Hello from Firebase Cloud Functions!' });
});

// Background function: on user create
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Example: create a user profile document in Firestore
  const db = admin.firestore();
  const profile = {
    email: user.email || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    role: 'immigrant'
  };
  await db.collection('users').doc(user.uid).set(profile);
  return null;
});

// Scheduled function (UTC cron) - runs daily
exports.dailyJob = functions.pubsub.schedule('0 0 * * *').timeZone('UTC').onRun(async (context) => {
  // Example: clean up old records or send summary
  console.log('Daily job running at', new Date().toISOString());
  return null;
});

// Callable function: submit volunteer signup
exports.submitVolunteerSignup = functions.https.onCall(async (data, context) => {
  try {
    const { name, email, activityId, message } = data;
    if (!name || !email || !activityId) {
      return { success: false, message: 'Missing required fields' };
    }
    const db = admin.firestore();
    const docRef = await db.collection('volunteerSignups').add({
      name,
      email,
      activityId,
      message: message || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error('submitVolunteerSignup error', err);
    return { success: false, message: err.message };
  }
});
