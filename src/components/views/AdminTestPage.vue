<template>
  <div class="admin-test-page">
    <div class="container">
      <div class="test-header">
        <h1 class="display-4">🎛️ Admin Dashboard Test Center</h1>
        <p class="lead">Quick access to all administrative features for testing</p>
      </div>

      <!-- 用户状态信息 -->
      <div class="user-status-card">
        <h3>👤 Current User Status</h3>
        <div v-if="user" class="user-info">
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ user.name || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ user.email || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Role:</span>
            <span class="value" :class="user.role">{{ user.role || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Authenticated:</span>
            <span class="value" :class="isAuthenticated ? 'success' : 'danger'">
              {{ isAuthenticated ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
        <div v-else class="no-user">
          <p>No user data available. Please log in first.</p>
          <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
        </div>
      </div>

      <!-- 权限管理工具 -->
      <div class="role-management-card" v-if="user">
        <h3>🔑 Role Management (Testing Only)</h3>
        <p>Use these buttons to test different user roles:</p>
        <div class="role-buttons">
          <button @click="setRole('admin')" class="btn btn-role admin">
            <i class="fas fa-crown"></i>
            Set Admin Role
          </button>
          <button @click="setRole('staff')" class="btn btn-role staff">
            <i class="fas fa-user-tie"></i>
            Set Staff Role
          </button>
          <button @click="setRole('volunteer')" class="btn btn-role volunteer">
            <i class="fas fa-hands-helping"></i>
            Set Volunteer Role
          </button>
          <button @click="setRole('immigrant')" class="btn btn-role immigrant">
            <i class="fas fa-user"></i>
            Set Immigrant Role
          </button>
        </div>
      </div>

      <!-- 功能快速访问 -->
      <div class="feature-access-grid">
        <div class="feature-category">
          <h3>📊 Analytics & Dashboards</h3>
          <div class="feature-links">
            <router-link to="/dashboard" class="feature-link analytics">
              <i class="fas fa-chart-line"></i>
              <div class="link-content">
                <h4>Interactive Dashboard</h4>
                <p>Real-time analytics and data visualization</p>
              </div>
            </router-link>
            <router-link to="/admin-dashboard" class="feature-link admin">
              <i class="fas fa-tachometer-alt"></i>
              <div class="link-content">
                <h4>Admin Dashboard</h4>
                <p>Comprehensive platform management</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="feature-category">
          <h3>📅 Booking & Appointments</h3>
          <div class="feature-links">
            <router-link to="/appointment-booking" class="feature-link booking">
              <i class="fas fa-calendar-plus"></i>
              <div class="link-content">
                <h4>Appointment Booking</h4>
                <p>Smart scheduling with calendar constraints</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="feature-category">
          <h3>📧 Communication</h3>
          <div class="feature-links">
            <router-link to="/bulk-email" class="feature-link email">
              <i class="fas fa-envelope-open-text"></i>
              <div class="link-content">
                <h4>Bulk Email System</h4>
                <p>Advanced email campaigns and templates</p>
              </div>
            </router-link>
            <router-link to="/email" class="feature-link simple-email">
              <i class="fas fa-envelope"></i>
              <div class="link-content">
                <h4>Simple Email</h4>
                <p>Basic email sending functionality</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="feature-category">
          <h3>👥 User Management</h3>
          <div class="feature-links">
            <router-link to="/profile" class="feature-link profile">
              <i class="fas fa-user-circle"></i>
              <div class="link-content">
                <h4>User Profile</h4>
                <p>View and edit user information</p>
              </div>
            </router-link>
            <router-link to="/admin/activities" class="feature-link activities">
              <i class="fas fa-tasks"></i>
              <div class="link-content">
                <h4>Manage Activities</h4>
                <p>Administrative activity management</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 开发工具 -->
      <div class="dev-tools-card">
        <h3>🛠️ Development Tools</h3>
        <div class="dev-actions">
          <button @click="clearStorage" class="btn btn-warning">
            <i class="fas fa-trash"></i>
            Clear Local Storage
          </button>
          <button @click="refreshPage" class="btn btn-secondary">
            <i class="fas fa-sync-alt"></i>
            Refresh Page
          </button>
          <button @click="viewConsole" class="btn btn-info">
            <i class="fas fa-terminal"></i>
            View Console Logs
          </button>
        </div>
      </div>

      <!-- 直接链接区域 -->
      <div class="direct-links-card">
        <h3>🔗 Direct Access Links</h3>
        <div class="link-grid">
          <a href="/admin-dashboard" target="_blank" class="direct-link">
            🎛️ Admin Dashboard (New Tab)
          </a>
          <a href="/dashboard" target="_blank" class="direct-link">
            📊 Interactive Dashboard (New Tab)
          </a>
          <a href="/appointment-booking" target="_blank" class="direct-link">
            📅 Appointment Booking (New Tab)
          </a>
          <a href="/bulk-email" target="_blank" class="direct-link">
            📧 Bulk Email System (New Tab)
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/store';

export default {
  name: 'AdminTestPage',
  setup() {
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.user);

    const setRole = (role) => {
      if (authStore.user) {
        authStore.user.role = role;
        alert(`Role set to: ${role}`);
      }
    };

    const clearStorage = () => {
      localStorage.clear();
      sessionStorage.clear();
      alert('Storage cleared! Please refresh the page.');
    };

    const refreshPage = () => {
      window.location.reload();
    };

    const viewConsole = () => {
      console.log('=== CURRENT USER STATE ===');
      console.log('isAuthenticated:', isAuthenticated.value);
      console.log('user:', user.value);
      console.log('authStore:', authStore);
      alert('Check browser console for detailed logs');
    };

    return {
      isAuthenticated,
      user,
      setRole,
      clearStorage,
      refreshPage,
      viewConsole
    };
  }
};
</script>

<style scoped>
.admin-test-page {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.test-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.test-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.test-header .lead {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 卡片样式 */
.user-status-card,
.role-management-card,
.dev-tools-card,
.direct-links-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.user-status-card h3,
.role-management-card h3,
.dev-tools-card h3,
.direct-links-card h3 {
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 用户信息 */
.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  font-weight: 500;
}

.value.admin { color: #e74c3c; }
.value.staff { color: #f39c12; }
.value.volunteer { color: #3498db; }
.value.immigrant { color: #27ae60; }
.value.success { color: #27ae60; }
.value.danger { color: #e74c3c; }

/* 角色按钮 */
.role-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-role {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-role.admin {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-role.staff {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.btn-role.volunteer {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-role.immigrant {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
}

.btn-role:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 功能访问网格 */
.feature-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.feature-category {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-category h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.feature-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.feature-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: white;
}

.feature-link.analytics {
  background: linear-gradient(135deg, #4ecdc4, #00d2d3);
}

.feature-link.admin {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.feature-link.booking {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.feature-link.email {
  background: linear-gradient(135deg, #45b7d1, #96c93d);
}

.feature-link.simple-email {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333 !important;
}

.feature-link.profile {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.feature-link.activities {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #333 !important;
}

.feature-link i {
  font-size: 2rem;
  flex-shrink: 0;
}

.link-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.link-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 开发工具 */
.dev-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 直接链接 */
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.direct-link {
  padding: 1rem;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.direct-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: white;
}

.no-user {
  text-align: center;
  padding: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-header h1 {
    font-size: 2rem;
  }
  
  .user-info {
    grid-template-columns: 1fr;
  }
  
  .role-buttons {
    flex-direction: column;
  }
  
  .feature-access-grid {
    grid-template-columns: 1fr;
  }
  
  .dev-actions {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
