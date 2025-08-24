<template>
  <div>
    <div class="hero-section bg-primary text-white py-5">
      <div class="container text-center">
        <h1 class="display-4">Welcome to Immigrant Health Support</h1>
        <p class="lead">Your trusted resource for healthcare information and support</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-light btn-lg mt-3">
          Join Our Community
        </router-link>
      </div>
    </div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-heart-pulse display-4 text-primary"></i>
              <h3 class="card-title mt-3">Healthcare Resources</h3>
              <p class="card-text">Find healthcare providers, insurance information, and health education materials.</p>
              <router-link to="/resources" class="btn btn-outline-primary">Explore Resources</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-people display-4 text-primary"></i>
              <h3 class="card-title mt-3">Community Support</h3>
              <p class="card-text">Connect with others, share experiences, and get support from our community.</p>
              <router-link to="/community" class="btn btn-outline-primary">Join Community</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-info-circle display-4 text-primary"></i>
              <h3 class="card-title mt-3">Information Hub</h3>
              <p class="card-text">Access reliable information about healthcare rights and services for immigrants.</p>
              <router-link to="/resources" class="btn btn-outline-primary">Learn More</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新功能展示区域 - 仅登录用户可见 -->
    <div v-if="isAuthenticated" class="container mt-5">
      <h2 class="text-center mb-4">🚀 New Enhanced Features</h2>
      
      <!-- 开发测试区域 -->
      <div class="alert alert-info mb-4" v-if="user">
        <h5>👤 Current User Info (Dev Mode):</h5>
        <p><strong>Name:</strong> {{ user.name || 'N/A' }}</p>
        <p><strong>Email:</strong> {{ user.email || 'N/A' }}</p>
        <p><strong>Role:</strong> {{ user.role || 'N/A' }}</p>
        <div class="mt-3">
          <router-link to="/admin-test" class="btn btn-success me-2">
            🧪 Test Center - All Features
          </router-link>
          <router-link to="/admin-dashboard" class="btn btn-warning me-2">
            🎛️ Direct Admin Dashboard Access (Test)
          </router-link>
          <button @click="setAdminRole" class="btn btn-secondary">
            🔑 Set Admin Role (For Testing)
          </button>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="feature-card h-100">
            <div class="feature-icon">
              <i class="fas fa-calendar-plus"></i>
            </div>
            <div class="feature-content">
              <h4 class="feature-title">Smart Booking</h4>
              <p class="feature-description">Schedule appointments with intelligent calendar constraints and real-time availability.</p>
              <router-link to="/appointment-booking" class="btn btn-feature">
                <i class="fas fa-arrow-right"></i>
                Book Now
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="feature-card h-100">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="feature-content">
              <h4 class="feature-title">Analytics Hub</h4>
              <p class="feature-description">Interactive dashboards with real-time insights and comprehensive data visualization.</p>
              <router-link to="/dashboard" class="btn btn-feature">
                <i class="fas fa-arrow-right"></i>
                View Dashboard
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4" v-if="user && (user.role === 'admin' || user.role === 'staff')">
          <div class="feature-card h-100">
            <div class="feature-icon">
              <i class="fas fa-envelope-open-text"></i>
            </div>
            <div class="feature-content">
              <h4 class="feature-title">Email Campaigns</h4>
              <p class="feature-description">Advanced bulk email system with templates, scheduling, and analytics tracking.</p>
              <router-link to="/bulk-email" class="btn btn-feature">
                <i class="fas fa-arrow-right"></i>
                Manage Emails
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4" v-if="user && user.role === 'admin'">
          <div class="feature-card h-100">
            <div class="feature-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="feature-content">
              <h4 class="feature-title">Admin Control</h4>
              <p class="feature-description">Comprehensive platform management with user oversight and system configuration.</p>
              <router-link to="/admin-dashboard" class="btn btn-feature">
                <i class="fas fa-arrow-right"></i>
                Admin Panel
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-light py-5 mt-5">
      <div class="container">
        <h2 class="text-center mb-4">Featured Resources</h2>
        <div class="row">
          <div v-for="resource in featuredResources" :key="resource.id" class="col-md-4 mb-4">
            <ResourceCard :resource="resource" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store'
import { useResourceStore } from '@/store'
import ResourceCard from '@/components/shared/ResourceCard.vue'

const authStore = useAuthStore()
const resourceStore = useResourceStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const featuredResources = computed(() => {
  return resourceStore.resources.slice(0, 3)
})

// 开发测试方法 - 设置管理员角色
const setAdminRole = () => {
  if (authStore.user) {
    authStore.user.role = 'admin'
    alert('Role set to admin! You can now access admin features.')
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://via.placeholder.com/1500x500');
  background-size: cover;
  background-position: center;
  border-radius: 0 0 50% 50% / 0 0 100px 100px;
}

/* 新功能卡片样式 */
.feature-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.feature-card:nth-child(1) {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.feature-card:nth-child(2) {
  background: linear-gradient(135deg, #4ecdc4 0%, #00d2d3 100%);
}

.feature-card:nth-child(3) {
  background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
}

.feature-card:nth-child(4) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-content {
  position: relative;
  z-index: 1;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-feature {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-feature:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
  text-decoration: none;
}

.btn-feature i {
  transition: transform 0.3s ease;
}

.btn-feature:hover i {
  transform: translateX(3px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .feature-card {
    padding: 1.5rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .feature-icon i {
    font-size: 1.5rem;
  }
  
  .feature-title {
    font-size: 1.2rem;
  }
  
  .feature-description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}
</style>