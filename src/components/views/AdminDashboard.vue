<template>
  <div class="admin-dashboard">
    <div class="container">
      <!-- 仪表板标题 -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">
          <i class="fas fa-tachometer-alt"></i>
          Admin Management Dashboard
        </h1>
        <p class="dashboard-subtitle">Comprehensive platform administration and oversight</p>
        
        <!-- 快速操作按钮 -->
        <div class="quick-actions">
          <button @click="activeSection = 'analytics'" class="action-btn" :class="{ active: activeSection === 'analytics' }">
            <i class="fas fa-chart-bar"></i>
            Analytics
          </button>
          <button @click="activeSection = 'users'" class="action-btn" :class="{ active: activeSection === 'users' }">
            <i class="fas fa-users"></i>
            User Management
          </button>
          <button @click="activeSection = 'appointments'" class="action-btn" :class="{ active: activeSection === 'appointments' }">
            <i class="fas fa-calendar"></i>
            Appointments
          </button>
          <button @click="activeSection = 'emails'" class="action-btn" :class="{ active: activeSection === 'emails' }">
            <i class="fas fa-envelope"></i>
            Email Campaigns
          </button>
          <button @click="activeSection = 'settings'" class="action-btn" :class="{ active: activeSection === 'settings' }">
            <i class="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>

      <!-- 关键统计指标 -->
      <div class="stats-overview">
        <div class="stat-card" v-for="stat in keyStats" :key="stat.id">
          <div class="stat-icon" :class="stat.iconClass">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ formatNumber(stat.value) }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
            <div class="stat-trend" :class="stat.trend">
              <i :class="stat.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ stat.change }}%
            </div>
          </div>
          <div class="stat-actions">
            <button @click="viewDetails(stat.id)" class="btn-icon">
              <i class="fas fa-eye"></i>
            </button>
            <button @click="exportData(stat.id)" class="btn-icon">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- Analytics Section -->
        <div v-if="activeSection === 'analytics'" class="section analytics-section">
          <div class="section-header">
            <h2>Platform Analytics</h2>
            <div class="section-controls">
              <select v-model="analyticsTimeframe" @change="refreshAnalytics">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button @click="refreshAnalytics" class="btn btn-primary">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
                Refresh
              </button>
            </div>
          </div>
          
          <!-- 嵌入交互式仪表板组件 -->
          <div class="analytics-content">
            <InteractiveDashboard />
          </div>
        </div>

        <!-- User Management Section -->
        <div v-if="activeSection === 'users'" class="section users-section">
          <div class="section-header">
            <h2>User Management</h2>
            <div class="section-controls">
              <input 
                type="text" 
                v-model="userSearch" 
                placeholder="Search users..." 
                class="search-input"
              >
              <select v-model="userFilter">
                <option value="all">All Users</option>
                <option value="volunteers">Volunteers</option>
                <option value="immigrants">Immigrants</option>
                <option value="staff">Staff</option>
                <option value="admins">Admins</option>
              </select>
              <button @click="addNewUser" class="btn btn-success">
                <i class="fas fa-plus"></i>
                Add User
              </button>
            </div>
          </div>

          <div class="users-grid">
            <div class="user-card" v-for="user in filteredUsers" :key="user.id">
              <div class="user-avatar">
                <img :src="user.avatar || '/default-avatar.png'" :alt="user.name">
                <div class="user-status" :class="user.status"></div>
              </div>
              <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p class="user-email">{{ user.email }}</p>
                <div class="user-meta">
                  <span class="user-role" :class="user.role">{{ user.role }}</span>
                  <span class="user-joined">Joined {{ formatDate(user.joinDate) }}</span>
                </div>
              </div>
              <div class="user-actions">
                <button @click="editUser(user)" class="btn-icon" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="viewUserDetails(user)" class="btn-icon" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="suspendUser(user)" class="btn-icon danger" title="Suspend">
                  <i class="fas fa-ban"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 用户详情模态框 -->
          <div v-if="selectedUser" class="modal-overlay" @click="closeUserModal">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>User Details</h3>
                <button @click="closeUserModal" class="modal-close">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="user-details">
                  <div class="detail-group">
                    <label>Name:</label>
                    <input v-model="selectedUser.name" :disabled="!isEditing">
                  </div>
                  <div class="detail-group">
                    <label>Email:</label>
                    <input v-model="selectedUser.email" :disabled="!isEditing">
                  </div>
                  <div class="detail-group">
                    <label>Role:</label>
                    <select v-model="selectedUser.role" :disabled="!isEditing">
                      <option value="volunteer">Volunteer</option>
                      <option value="immigrant">Immigrant</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div class="detail-group">
                    <label>Status:</label>
                    <select v-model="selectedUser.status" :disabled="!isEditing">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button v-if="!isEditing" @click="isEditing = true" class="btn btn-primary">
                  Edit
                </button>
                <template v-else>
                  <button @click="saveUser" class="btn btn-success">Save</button>
                  <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments Section -->
        <div v-if="activeSection === 'appointments'" class="section appointments-section">
          <div class="section-header">
            <h2>Appointment Management</h2>
            <div class="section-controls">
              <input 
                type="date" 
                v-model="appointmentDate"
                class="date-input"
              >
              <select v-model="appointmentStatus">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button @click="exportAppointments" class="btn btn-secondary">
                <i class="fas fa-file-export"></i>
                Export
              </button>
            </div>
          </div>

          <div class="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in filteredAppointments" :key="appointment.id">
                  <td>
                    <div class="appointment-datetime">
                      <div class="date">{{ formatDate(appointment.date) }}</div>
                      <div class="time">{{ appointment.time }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="patient-info">
                      <div class="name">{{ appointment.patient.name }}</div>
                      <div class="email">{{ appointment.patient.email }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="service-type">{{ appointment.service }}</span>
                  </td>
                  <td>
                    <div class="provider-info">
                      <div class="name">{{ appointment.provider.name }}</div>
                      <div class="role">{{ appointment.provider.role }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="appointment.status">
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td>
                    <div class="appointment-actions">
                      <button @click="confirmAppointment(appointment)" class="btn-icon" title="Confirm">
                        <i class="fas fa-check"></i>
                      </button>
                      <button @click="rescheduleAppointment(appointment)" class="btn-icon" title="Reschedule">
                        <i class="fas fa-calendar-alt"></i>
                      </button>
                      <button @click="cancelAppointment(appointment)" class="btn-icon danger" title="Cancel">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Email Campaigns Section -->
        <div v-if="activeSection === 'emails'" class="section emails-section">
          <div class="section-header">
            <h2>Email Campaign Management</h2>
            <div class="section-controls">
              <button @click="createNewCampaign" class="btn btn-success">
                <i class="fas fa-plus"></i>
                New Campaign
              </button>
              <button @click="openBulkEmailSystem" class="btn btn-primary">
                <i class="fas fa-envelope-open-text"></i>
                Bulk Email System
              </button>
            </div>
          </div>

          <div class="campaigns-grid">
            <div class="campaign-card" v-for="campaign in emailCampaigns" :key="campaign.id">
              <div class="campaign-header">
                <h3>{{ campaign.subject }}</h3>
                <div class="campaign-status" :class="campaign.status">
                  {{ campaign.status }}
                </div>
              </div>
              <div class="campaign-stats">
                <div class="stat">
                  <span class="label">Recipients:</span>
                  <span class="value">{{ campaign.recipients }}</span>
                </div>
                <div class="stat">
                  <span class="label">Delivered:</span>
                  <span class="value">{{ campaign.delivered }}</span>
                </div>
                <div class="stat">
                  <span class="label">Open Rate:</span>
                  <span class="value">{{ campaign.openRate }}%</span>
                </div>
                <div class="stat">
                  <span class="label">Click Rate:</span>
                  <span class="value">{{ campaign.clickRate }}%</span>
                </div>
              </div>
              <div class="campaign-actions">
                <button @click="viewCampaign(campaign)" class="btn btn-outline">
                  <i class="fas fa-eye"></i>
                  View
                </button>
                <button @click="duplicateCampaign(campaign)" class="btn btn-outline">
                  <i class="fas fa-copy"></i>
                  Duplicate
                </button>
                <button @click="deleteCampaign(campaign)" class="btn btn-danger">
                  <i class="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div v-if="activeSection === 'settings'" class="section settings-section">
          <div class="section-header">
            <h2>Platform Settings</h2>
          </div>

          <div class="settings-tabs">
            <button 
              v-for="tab in settingsTabs" 
              :key="tab.id"
              @click="activeSettingsTab = tab.id"
              class="tab-btn"
              :class="{ active: activeSettingsTab === tab.id }"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>

          <div class="settings-content">
            <!-- General Settings -->
            <div v-if="activeSettingsTab === 'general'" class="settings-panel">
              <h3>General Settings</h3>
              <div class="setting-group">
                <label>Platform Name:</label>
                <input v-model="settings.platformName" type="text">
              </div>
              <div class="setting-group">
                <label>Contact Email:</label>
                <input v-model="settings.contactEmail" type="email">
              </div>
              <div class="setting-group">
                <label>Maintenance Mode:</label>
                <label class="switch">
                  <input type="checkbox" v-model="settings.maintenanceMode">
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <!-- Email Settings -->
            <div v-if="activeSettingsTab === 'email'" class="settings-panel">
              <h3>Email Configuration</h3>
              <div class="setting-group">
                <label>SMTP Server:</label>
                <input v-model="settings.smtpServer" type="text">
              </div>
              <div class="setting-group">
                <label>SMTP Port:</label>
                <input v-model="settings.smtpPort" type="number">
              </div>
              <div class="setting-group">
                <label>From Email:</label>
                <input v-model="settings.fromEmail" type="email">
              </div>
            </div>

            <!-- Security Settings -->
            <div v-if="activeSettingsTab === 'security'" class="settings-panel">
              <h3>Security Configuration</h3>
              <div class="setting-group">
                <label>Session Timeout (minutes):</label>
                <input v-model="settings.sessionTimeout" type="number">
              </div>
              <div class="setting-group">
                <label>Password Policy:</label>
                <select v-model="settings.passwordPolicy">
                  <option value="basic">Basic</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
              <div class="setting-group">
                <label>Two-Factor Authentication:</label>
                <label class="switch">
                  <input type="checkbox" v-model="settings.twoFactorAuth">
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <!-- API Settings -->
            <div v-if="activeSettingsTab === 'api'" class="settings-panel">
              <h3>API Configuration</h3>
              <div class="setting-group">
                <label>API Rate Limit (requests/hour):</label>
                <input v-model="settings.apiRateLimit" type="number">
              </div>
              <div class="setting-group">
                <label>API Key:</label>
                <div class="api-key-container">
                  <input 
                    v-model="settings.apiKey" 
                    type="password" 
                    readonly
                    class="api-key-input"
                  >
                  <button @click="regenerateApiKey" class="btn btn-secondary">
                    <i class="fas fa-sync-alt"></i>
                    Regenerate
                  </button>
                </div>
              </div>
              <div class="setting-group">
                <label>API Documentation:</label>
                <button @click="openApiDocs" class="btn btn-outline">
                  <i class="fas fa-book"></i>
                  View Documentation
                </button>
              </div>
            </div>
          </div>

          <div class="settings-actions">
            <button @click="saveSettings" class="btn btn-success">
              <i class="fas fa-save"></i>
              Save Settings
            </button>
            <button @click="resetSettings" class="btn btn-secondary">
              <i class="fas fa-undo"></i>
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import InteractiveDashboard from './InteractiveDashboard.vue';

export default {
  name: 'AdminDashboard',
  components: {
    InteractiveDashboard
  },
  setup() {
    // 路由
    const router = useRouter();
    
    // 响应式数据
    const isLoading = ref(false);
    const activeSection = ref('analytics');
    const activeSettingsTab = ref('general');
    
    // 用户管理
    const userSearch = ref('');
    const userFilter = ref('all');
    const selectedUser = ref(null);
    const isEditing = ref(false);
    
    // 预约管理
    const appointmentDate = ref('');
    const appointmentStatus = ref('all');
    
    // 分析时间框架
    const analyticsTimeframe = ref('month');

    // 关键统计数据
    const keyStats = ref([
      {
        id: 'totalUsers',
        label: 'Total Users',
        value: 1847,
        change: 12.5,
        trend: 'up',
        icon: 'fas fa-users',
        iconClass: 'blue'
      },
      {
        id: 'activeAppointments',
        label: 'Active Appointments',
        value: 156,
        change: 8.3,
        trend: 'up',
        icon: 'fas fa-calendar-check',
        iconClass: 'green'
      },
      {
        id: 'emailsSent',
        label: 'Emails Sent (Monthly)',
        value: 4329,
        change: -2.1,
        trend: 'down',
        icon: 'fas fa-envelope',
        iconClass: 'orange'
      },
      {
        id: 'systemHealth',
        label: 'System Health',
        value: 98.7,
        change: 1.2,
        trend: 'up',
        icon: 'fas fa-heartbeat',
        iconClass: 'purple'
      }
    ]);

    // 模拟用户数据
    const users = ref([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'volunteer',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        avatar: null
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'immigrant',
        status: 'active',
        joinDate: new Date('2024-01-10'),
        avatar: null
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'staff',
        status: 'active',
        joinDate: new Date('2024-01-08'),
        avatar: null
      }
    ]);

    // 模拟预约数据
    const appointments = ref([
      {
        id: 1,
        date: new Date('2024-02-15'),
        time: '10:00',
        patient: { name: 'John Doe', email: 'john@example.com' },
        service: 'Healthcare Consultation',
        provider: { name: 'Dr. Smith', role: 'Doctor' },
        status: 'confirmed'
      },
      {
        id: 2,
        date: new Date('2024-02-16'),
        time: '14:30',
        patient: { name: 'Jane Smith', email: 'jane@example.com' },
        service: 'Legal Aid',
        provider: { name: 'Mr. Johnson', role: 'Lawyer' },
        status: 'pending'
      }
    ]);

    // 模拟邮件活动数据
    const emailCampaigns = ref([
      {
        id: 1,
        subject: 'Welcome to CareNexus',
        status: 'sent',
        recipients: 250,
        delivered: 248,
        openRate: 65.3,
        clickRate: 12.4,
        sentDate: new Date('2024-02-10')
      },
      {
        id: 2,
        subject: 'Monthly Newsletter - February',
        status: 'draft',
        recipients: 300,
        delivered: 0,
        openRate: 0,
        clickRate: 0,
        sentDate: null
      }
    ]);

    // 设置数据
    const settings = ref({
      platformName: 'CareNexus',
      contactEmail: 'admin@carenexus.com',
      maintenanceMode: false,
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      fromEmail: 'noreply@carenexus.com',
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      twoFactorAuth: false,
      apiRateLimit: 1000,
      apiKey: '••••••••••••••••••••••••••••••••'
    });

    // 设置标签
    const settingsTabs = ref([
      { id: 'general', label: 'General', icon: 'fas fa-cog' },
      { id: 'email', label: 'Email', icon: 'fas fa-envelope' },
      { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
      { id: 'api', label: 'API', icon: 'fas fa-code' }
    ]);

    // 计算属性
    const filteredUsers = computed(() => {
      let filtered = users.value;
      
      if (userFilter.value !== 'all') {
        filtered = filtered.filter(user => user.role === userFilter.value);
      }
      
      if (userSearch.value) {
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.value.toLowerCase())
        );
      }
      
      return filtered;
    });

    const filteredAppointments = computed(() => {
      let filtered = appointments.value;
      
      if (appointmentStatus.value !== 'all') {
        filtered = filtered.filter(appointment => appointment.status === appointmentStatus.value);
      }
      
      if (appointmentDate.value) {
        const selectedDate = new Date(appointmentDate.value);
        filtered = filtered.filter(appointment => 
          appointment.date.toDateString() === selectedDate.toDateString()
        );
      }
      
      return filtered;
    });

    // 方法
    const formatNumber = (value) => {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toString();
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const viewDetails = (statId) => {
      console.log('Viewing details for:', statId);
      // 实现详情查看逻辑
    };

    const exportData = (statId) => {
      console.log('Exporting data for:', statId);
      // 实现数据导出逻辑
    };

    const refreshAnalytics = () => {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    };

    // 用户管理方法
    const addNewUser = () => {
      console.log('Adding new user');
      // 实现添加用户逻辑
    };

    const editUser = (user) => {
      selectedUser.value = { ...user };
      isEditing.value = true;
    };

    const viewUserDetails = (user) => {
      selectedUser.value = { ...user };
      isEditing.value = false;
    };

    const closeUserModal = () => {
      selectedUser.value = null;
      isEditing.value = false;
    };

    const saveUser = () => {
      // 实现保存用户逻辑
      const index = users.value.findIndex(u => u.id === selectedUser.value.id);
      if (index !== -1) {
        users.value[index] = { ...selectedUser.value };
      }
      closeUserModal();
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const suspendUser = (user) => {
      if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
        const index = users.value.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users.value[index].status = 'suspended';
        }
      }
    };

    // 预约管理方法
    const confirmAppointment = (appointment) => {
      appointment.status = 'confirmed';
    };

    const rescheduleAppointment = (appointment) => {
      console.log('Rescheduling appointment:', appointment);
      // 实现重新安排预约逻辑
    };

    const cancelAppointment = (appointment) => {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        appointment.status = 'cancelled';
      }
    };

    const exportAppointments = () => {
      console.log('Exporting appointments');
      // 实现导出预约逻辑
    };

    // 邮件活动方法
    const createNewCampaign = () => {
      console.log('Creating new campaign');
      // 实现创建新活动逻辑
    };

    const openBulkEmailSystem = () => {
      // 跳转到批量邮件系统
      router.push('/bulk-email');
    };

    const viewCampaign = (campaign) => {
      console.log('Viewing campaign:', campaign);
      // 实现查看活动逻辑
    };

    const duplicateCampaign = (campaign) => {
      console.log('Duplicating campaign:', campaign);
      // 实现复制活动逻辑
    };

    const deleteCampaign = (campaign) => {
      if (confirm(`Are you sure you want to delete "${campaign.subject}"?`)) {
        const index = emailCampaigns.value.findIndex(c => c.id === campaign.id);
        if (index !== -1) {
          emailCampaigns.value.splice(index, 1);
        }
      }
    };

    // 设置方法
    const saveSettings = () => {
      console.log('Saving settings:', settings.value);
      // 实现保存设置逻辑
      alert('Settings saved successfully!');
    };

    const resetSettings = () => {
      if (confirm('Are you sure you want to reset all settings to default?')) {
        // 重置设置逻辑
        console.log('Resetting settings');
      }
    };

    const regenerateApiKey = () => {
      if (confirm('Are you sure you want to regenerate the API key? This will invalidate the current key.')) {
        settings.value.apiKey = '••••••••••••••••••••••••••••••••';
        alert('API key regenerated successfully!');
      }
    };

    const openApiDocs = () => {
      window.open('/api-docs', '_blank');
    };

    return {
      // 响应式数据
      isLoading,
      activeSection,
      activeSettingsTab,
      userSearch,
      userFilter,
      selectedUser,
      isEditing,
      appointmentDate,
      appointmentStatus,
      analyticsTimeframe,
      keyStats,
      users,
      appointments,
      emailCampaigns,
      settings,
      settingsTabs,
      
      // 计算属性
      filteredUsers,
      filteredAppointments,
      
      // 方法
      formatNumber,
      formatDate,
      viewDetails,
      exportData,
      refreshAnalytics,
      addNewUser,
      editUser,
      viewUserDetails,
      closeUserModal,
      saveUser,
      cancelEdit,
      suspendUser,
      confirmAppointment,
      rescheduleAppointment,
      cancelAppointment,
      exportAppointments,
      createNewCampaign,
      openBulkEmailSystem,
      viewCampaign,
      duplicateCampaign,
      deleteCampaign,
      saveSettings,
      resetSettings,
      regenerateApiKey,
      openApiDocs
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 仪表板标题 */
.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dashboard-title i {
  margin-right: 1rem;
  color: hsla(160, 100%, 37%, 1);
}

.dashboard-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

/* 快速操作按钮 */
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.action-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 5px 15px rgba(0, 185, 113, 0.3);
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.stat-icon.blue { background: linear-gradient(135deg, #007bff, #0056b3); }
.stat-icon.green { background: linear-gradient(135deg, #28a745, #1e7e34); }
.stat-icon.orange { background: linear-gradient(135deg, #fd7e14, #e85d04); }
.stat-icon.purple { background: linear-gradient(135deg, #6f42c1, #5a189a); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.stat-label {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-trend.up { color: #28a745; }
.stat-trend.down { color: #dc3545; }

.stat-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 主要内容区域 */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
}

.section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.section-header h2 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
}

.section-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 分析部分 */
.analytics-content {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1rem;
}

/* 用户管理 */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  position: relative;
}

.user-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.user-status.active { background: #28a745; }
.user-status.inactive { background: #6c757d; }
.user-status.suspended { background: #dc3545; }

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.user-email {
  color: #666;
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.user-role {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
}

.user-role.volunteer { background: #d1ecf1; color: #0c5460; }
.user-role.immigrant { background: #f8d7da; color: #721c24; }
.user-role.staff { background: #e2e3e5; color: #383d41; }
.user-role.admin { background: #d4edda; color: #155724; }

.user-joined {
  font-size: 0.7rem;
  color: #999;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 预约表格 */
.appointments-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointments-table table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table th,
.appointments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.appointments-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.appointment-datetime .date {
  font-weight: 600;
  color: #333;
}

.appointment-datetime .time {
  font-size: 0.85rem;
  color: #666;
}

.patient-info .name {
  font-weight: 500;
  color: #333;
}

.patient-info .email {
  font-size: 0.85rem;
  color: #666;
}

.provider-info .name {
  font-weight: 500;
  color: #333;
}

.provider-info .role {
  font-size: 0.85rem;
  color: #666;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.confirmed { background: #d4edda; color: #155724; }
.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.completed { background: #d1ecf1; color: #0c5460; }
.status-badge.cancelled { background: #f8d7da; color: #721c24; }

.appointment-actions {
  display: flex;
  gap: 0.5rem;
}

/* 邮件活动 */
.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.campaign-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.campaign-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.campaign-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.campaign-status.sent { background: #d4edda; color: #155724; }
.campaign-status.draft { background: #e2e3e5; color: #383d41; }
.campaign-status.scheduled { background: #fff3cd; color: #856404; }

.campaign-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.campaign-stats .stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.campaign-stats .label {
  color: #666;
}

.campaign-stats .value {
  font-weight: 600;
  color: #333;
}

.campaign-actions {
  display: flex;
  gap: 0.5rem;
}

/* 设置 */
.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #333;
  background: #f8f9fa;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.settings-panel h3 {
  color: #333;
  margin-bottom: 1.5rem;
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.setting-group input,
.setting-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.api-key-container {
  display: flex;
  gap: 0.5rem;
}

.api-key-input {
  flex: 1;
}

/* 开关按钮 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.settings-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
}

.modal-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.detail-group {
  margin-bottom: 1rem;
}

.detail-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.detail-group input,
.detail-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-icon {
  padding: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #e9ecef;
  color: #007bff;
}

.btn-icon.danger {
  color: #dc3545;
}

.btn-icon.danger:hover {
  background: #f8d7da;
  border-color: #f5c6cb;
}

/* 表单控件 */
.search-input, .date-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
}

select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .section-controls {
    flex-wrap: wrap;
  }
  
  .users-grid, .campaigns-grid {
    grid-template-columns: 1fr;
  }
  
  .appointments-table {
    overflow-x: auto;
  }
  
  .settings-tabs {
    flex-wrap: wrap;
  }
  
  .campaign-stats {
    grid-template-columns: 1fr;
  }
  
  .user-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-content {
    padding: 1rem;
  }
}
</style>
