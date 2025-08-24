<template>
  
  <div id="app" class="dashboard-container">
    <!-- 头部区域 -->
    <div class="header-container">
      <h1 class="dashboard-title">
        <i class="fas fa-user-circle"></i>
        User Dashboard
      </h1>
      <router-link to="/profile/edit" class="edit-profile-btn">
        <i class="fas fa-edit"></i> Edit Profile
      </router-link>
    </div>
    
    <!-- 用户信息卡片 -->
    <div class="user-profile-card">
      <div class="profile-info">
        <div class="info-item">
          <i class="fas fa-user"></i>
          <div class="info-text">
            <span class="info-label">Full Name</span>
            <span v-if="user" class="info-value">{{ user.name }}</span>
            <span v-else class="info-value">Loading...</span>
          </div>
        </div>
        
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <div class="info-text">
            <span class="info-label">Email Address</span>
            <span v-if="user" class="info-value">{{ user.email }}</span>
            <span v-else class="info-value">Loading...</span>
          </div>
        </div>
        
        <div class="info-item">
          <i class="fas fa-phone"></i>
          <div class="info-text">
            <span class="info-label">Phone Number</span>
            <span v-if="user" class="info-value">{{ user.phone || 'Not provided' }}</span>
            <span v-else class="info-value">Loading...</span>
          </div>
        </div>
        
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <div class="info-text">
            <span class="info-label">Location</span>
            <span v-if="user" class="info-value">{{ user.location || 'Not provided' }}</span>
            <span v-else class="info-value">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 待评价服务区域 -->
    </div>
    
    <!-- 快速功能访问面板 -->
    <div class="quick-access-panel">
      <h2 class="panel-title">
        <i class="fas fa-bolt"></i>
        Quick Actions
      </h2>
      <div class="quick-actions-grid">
        <router-link to="/appointment-booking" class="quick-action-card">
          <div class="action-icon appointment">
            <i class="fas fa-calendar-plus"></i>
          </div>
          <div class="action-content">
            <h4>Book Appointment</h4>
            <p>Schedule your next service</p>
          </div>
        </router-link>
        
        <router-link to="/dashboard" class="quick-action-card">
          <div class="action-icon analytics">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="action-content">
            <h4>View Analytics</h4>
            <p>Check your activity dashboard</p>
          </div>
        </router-link>
        
        <router-link v-if="user && (user.role === 'admin' || user.role === 'staff')" to="/bulk-email" class="quick-action-card">
          <div class="action-icon email">
            <i class="fas fa-envelope-open-text"></i>
          </div>
          <div class="action-content">
            <h4>Email Campaigns</h4>
            <p>Manage bulk communications</p>
          </div>
        </router-link>
        
        <router-link v-if="user && user.role === 'admin'" to="/admin-dashboard" class="quick-action-card">
          <div class="action-icon admin">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <div class="action-content">
            <h4>Admin Panel</h4>
            <p>Platform management</p>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- 评分和反馈部分 -->
    <div class="rating-section">
      <h2 class="section-title">
        <i class="fas fa-star"></i>      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your pending ratings...</p>
      </div>
      
      <!-- 无待评价服务 -->
      <div v-else-if="pendingRatings.length === 0" class="no-ratings">
        <i class="fas fa-check-circle"></i>
        <h3>No Pending Ratings</h3>
        <p>You have no pending services to rate at this time.</p>
      </div>
      
      <!-- 有待评价服务 -->
      <div v-else>
        <div v-for="record in pendingRatings" :key="record.id" class="rating-card">
          <h3 class="service-title">
            <i class="fas" :class="getServiceIcon(record.activityTitle)"></i>
            {{ record.activityTitle }}
          </h3>
          
          <div class="volunteer-info">
            <div class="volunteer-avatar">{{ getInitials(record.volunteerName) }}</div>
            <div class="volunteer-text">
              <span class="volunteer-label">Assisting Volunteer</span>
              <span class="volunteer-name">{{ record.volunteerName }}</span>
            </div>
          </div>
          
          <div class="rating-inputs">
            <div class="rating-dimension">
              <label><i class="fas fa-suitcase"></i> Professionalism</label>
              <select v-model.number="ratings[record.id].professionalism" class="rating-select">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} - {{ getRatingLabel(n) }}</option>
              </select>
            </div>
            
            <div class="rating-dimension">
              <label><i class="fas fa-smile"></i> Friendliness</label>
              <select v-model.number="ratings[record.id].friendliness" class="rating-select">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} - {{ getRatingLabel(n) }}</option>
              </select>
            </div>
            
            <div class="rating-dimension">
              <label><i class="fas fa-hand-holding-heart"></i> Helpfulness</label>
              <select v-model.number="ratings[record.id].helpfulness" class="rating-select">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} - {{ getRatingLabel(n) }}</option>
              </select>
            </div>
          </div>
          
          <button @click="handleRatingSubmit(record.id)" class="submit-btn">
            <i class="fas fa-check-circle"></i> Submit Rating
          </button>
        </div>
      </div>
    </div>
  </div>
    
   

</template>

<script>
import { useAuthStore } from '@/store';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'UserProfile',
  data() {
    return {
      ratings: {}
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    pendingRatings() {
      const authStore = useAuthStore();
      return authStore.getPendingRatings();
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['submitRating', 'getVolunteerById']),
    getVolunteerName(volunteerId) {
      const volunteer = this.getVolunteerById(volunteerId);
      return volunteer ? volunteer.name : 'Unknown';
    },
    handleRatingSubmit(recordId) {
      this.submitRating(recordId, this.ratings[recordId]);
      alert('Thank you for your feedback!');
    },
    initializeRatings() {
      this.pendingRatings.forEach(record => {
        if (!this.ratings[record.id]) {
          this.ratings[record.id] = {
            professionalism: 5,
            friendliness: 5,
            helpfulness: 5
          };
        }
      });
    }
  },
  watch: {
    pendingRatings: {
      handler: 'initializeRatings',
      immediate: true
    }
  }
};
</script>

<style scoped>
    :root {
      --primary: #3498db;
      --secondary: #2c3e50;
      --accent: #27ae60;
      --light: #ecf0f1;
      --gray: #7f8c8d;
      --light-blue: #e3f2fd;
      --light-green: #e8f5e9;
    }
    
    * {
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, #f9fbfd 0%, #eef5fd 100%);
      min-height: 100vh;
      padding-top: 80px;
    }
    
    .dashboard-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* 快速访问面板样式 */
    .quick-access-panel {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
    
    .panel-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .panel-title i {
      color: #ffd700;
    }
    
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .quick-action-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 1.5rem;
      text-decoration: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .quick-action-card:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      color: white;
      text-decoration: none;
    }
    
    .action-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    
    .action-icon.appointment {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    }
    
    .action-icon.analytics {
      background: linear-gradient(135deg, #4ecdc4, #00d2d3);
    }
    
    .action-icon.email {
      background: linear-gradient(135deg, #45b7d1, #96c93d);
    }
    
    .action-icon.admin {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }
    
    .action-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .action-content p {
      margin: 0;
      font-size: 0.85rem;
      opacity: 0.9;
    }
    
    @media (max-width: 768px) {
      .quick-actions-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-action-card {
        padding: 1rem;
      }
      
      .action-icon {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 35px;
      background: white;
      border-radius: 15px;
      padding: 20px 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }
    
    .dashboard-title {
      color: var(--secondary);
      font-weight: 700;
      font-size: 2.2rem;
      display: flex;
      align-items: center;
    }
    
    .dashboard-title i {
      color: var(--primary);
      margin-right: 15px;
      background: rgba(52, 152, 219, 0.1);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .edit-profile-btn {
      background: linear-gradient(135deg, var(--primary) 0%, #1a73e8 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 25px;
      font-weight: 600;
      font-size: 1.05rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
      display: flex;
      align-items: center;
    }
    
    .edit-profile-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(52, 152, 219, 0.4);
    }
    
    .edit-profile-btn i {
      margin-right: 8px;
      background: transparent;
      width: auto;
      height: auto;
      color: white;
    }
    
    .user-profile-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      padding: 30px;
      margin-bottom: 40px;
      border-left: 5px solid var(--primary);
    }
    
    .profile-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background: var(--light-blue);
      border-radius: 12px;
    }
    
    .info-item i {
      font-size: 1.5rem;
      color: var(--primary);
      margin-right: 15px;
      background: rgba(52, 152, 219, 0.15);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .info-text {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      font-weight: 500;
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .info-value {
      font-weight: 600;
      color: var(--secondary);
      font-size: 1.2rem;
      margin-top: 5px;
    }
    
    .ratings-section {
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      padding: 30px;
      border-left: 5px solid var(--accent);
    }
    
    .section-title {
      color: var(--secondary);
      font-weight: 700;
      font-size: 1.75rem;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
    }
    
    .section-title i {
      color: var(--accent);
      margin-right: 15px;
      background: rgba(39, 174, 96, 0.15);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-ratings {
      text-align: center;
      padding: 30px;
      color: var(--gray);
    }
    
    .no-ratings i {
      font-size: 4rem;
      color: var(--light);
      margin-bottom: 20px;
    }
    
    .rating-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
      padding: 25px;
      margin-bottom: 25px;
      border: 1px solid rgba(52, 152, 219, 0.15);
      transition: all 0.3s ease;
    }
    
    .rating-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
      border-color: var(--primary);
    }
    
    .service-title {
      color: var(--secondary);
      font-weight: 700;
      font-size: 1.4rem;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    
    .service-title i {
      color: var(--primary);
      margin-right: 12px;
    }
    
    .volunteer-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--light);
    }
    
    .volunteer-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--secondary) 0%, #1a2530 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      margin-right: 15px;
    }
    
    .volunteer-text {
      display: flex;
      flex-direction: column;
    }
    
    .volunteer-label {
      font-weight: 500;
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .volunteer-name {
      font-weight: 600;
      color: var(--secondary);
      font-size: 1.1rem;
      margin-top: 3px;
    }
    
    .rating-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .rating-dimension {
      background: var(--light-green);
      border-radius: 12px;
      padding: 15px;
      transition: all 0.3s ease;
    }
    
    .rating-dimension:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .rating-dimension label {
      display: block;
      font-weight: 600;
      color: var(--secondary);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .rating-dimension label i {
      color: var(--accent);
      margin-right: 8px;
    }
    
    .rating-select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid rgba(52, 152, 219, 0.2);
      border-radius: 10px;
      background: white;
      font-weight: 500;
      color: var(--secondary);
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%233498db'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 15px center;
      background-size: 16px;
    }
    
    .rating-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    .rating-select option {
      padding: 10px;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, var(--accent) 0%, #219653 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 30px;
      font-weight: 600;
      font-size: 1.05rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
      display: flex;
      align-items: center;
      margin-top: 15px;
    }
    
    .submit-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(39, 174, 96, 0.4);
    }
    
    .submit-btn i {
      margin-right: 8px;
    }
    
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .dashboard-title {
        margin-bottom: 20px;
        font-size: 1.8rem;
      }
      
      .edit-profile-btn {
        align-self: flex-end;
      }
    }
  </style>
