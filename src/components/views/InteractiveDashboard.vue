<template>
  <div class="dashboard">
    <div class="container">
      <!-- 仪表板标题 -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">
          <i class="fas fa-chart-line"></i>
          Interactive Analytics Dashboard
        </h1>
        <p class="dashboard-subtitle">Real-time insights and data visualization</p>
        
        <!-- 控制面板 -->
        <div class="dashboard-controls">
          <div class="date-range-picker">
            <label>Date Range:</label>
            <select v-model="selectedPeriod" @change="updateCharts">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <div class="refresh-controls">
            <button @click="refreshData" class="btn btn-primary" :disabled="isLoading">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
              Refresh
            </button>
            <button @click="exportData" class="btn btn-secondary">
              <i class="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- 关键指标卡片 -->
      <div class="metrics-grid">
        <div class="metric-card" v-for="metric in keyMetrics" :key="metric.id">
          <div class="metric-icon" :class="metric.iconClass">
            <i :class="metric.icon"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ formatNumber(metric.value) }}</h3>
            <p class="metric-label">{{ metric.label }}</p>
            <div class="metric-change" :class="metric.trend">
              <i :class="metric.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ metric.change }}% vs last period
            </div>
          </div>
          <div class="metric-chart">
            <canvas :ref="`sparkline-${metric.id}`" width="100" height="30"></canvas>
          </div>
        </div>
      </div>

      <!-- 图表网格 -->
      <div class="charts-grid">
        <!-- 用户增长趋势 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>User Growth Trends</h3>
            <div class="chart-controls">
              <button 
                v-for="type in ['line', 'bar']" 
                :key="type"
                @click="userGrowthChartType = type"
                class="chart-type-btn"
                :class="{ active: userGrowthChartType === type }"
              >
                <i :class="type === 'line' ? 'fas fa-chart-line' : 'fas fa-chart-bar'"></i>
              </button>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="userGrowthChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- 服务使用分布 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>Service Usage Distribution</h3>
            <div class="chart-legend">
              <div v-for="service in serviceData" :key="service.name" class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: service.color }"></span>
                <span class="legend-label">{{ service.name }}</span>
              </div>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="serviceDistributionChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- 预约统计 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>Appointment Statistics</h3>
            <select v-model="appointmentChartView" @change="updateAppointmentChart">
              <option value="daily">Daily View</option>
              <option value="weekly">Weekly View</option>
              <option value="monthly">Monthly View</option>
            </select>
          </div>
          <div class="chart-content">
            <canvas ref="appointmentChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- 用户角色分布 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>User Role Distribution</h3>
            <div class="role-stats">
              <div v-for="role in roleDistribution" :key="role.name" class="role-stat">
                <span class="role-count">{{ role.count }}</span>
                <span class="role-name">{{ role.name }}</span>
              </div>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="roleDistributionChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- 地理分布热力图 -->
        <div class="chart-container full-width">
          <div class="chart-header">
            <h3>Geographic Distribution</h3>
            <div class="map-controls">
              <button 
                v-for="view in ['users', 'services', 'appointments']" 
                :key="view"
                @click="mapView = view"
                class="map-view-btn"
                :class="{ active: mapView === view }"
              >
                {{ view.charAt(0).toUpperCase() + view.slice(1) }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <div ref="heatmapContainer" class="heatmap-container"></div>
          </div>
        </div>

        <!-- 实时活动流 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>Real-time Activity Feed</h3>
            <div class="activity-filters">
              <button 
                v-for="filter in activityFilters" 
                :key="filter"
                @click="toggleActivityFilter(filter)"
                class="filter-btn"
                :class="{ active: activeActivityFilters.includes(filter) }"
              >
                {{ filter }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <div class="activity-feed">
              <div 
                v-for="activity in filteredActivities" 
                :key="activity.id"
                class="activity-item"
                :class="activity.type"
              >
                <div class="activity-icon">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p class="activity-message">{{ activity.message }}</p>
                  <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 性能指标雷达图 -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>Performance Metrics</h3>
            <div class="performance-legend">
              <div class="legend-item">
                <span class="legend-color current"></span>
                <span>Current Period</span>
              </div>
              <div class="legend-item">
                <span class="legend-color previous"></span>
                <span>Previous Period</span>
              </div>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="performanceRadarChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="data-table-section">
        <div class="table-header">
          <h3>Detailed Analytics</h3>
          <div class="table-controls">
            <select v-model="selectedTable" @change="loadTableData">
              <option value="users">Users</option>
              <option value="appointments">Appointments</option>
              <option value="services">Services</option>
              <option value="emails">Email Campaigns</option>
            </select>
            <input 
              type="text" 
              v-model="tableSearch" 
              placeholder="Search..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="column in currentTableColumns" :key="column.key" @click="sortTable(column.key)">
                  {{ column.label }}
                  <i v-if="sortColumn === column.key" :class="sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedTableData" :key="row.id">
                <td v-for="column in currentTableColumns" :key="column.key">
                  <span v-if="column.type === 'badge'" class="table-badge" :class="row[column.key]">
                    {{ row[column.key] }}
                  </span>
                  <span v-else-if="column.type === 'date'">
                    {{ formatDate(row[column.key]) }}
                  </span>
                  <span v-else>
                    {{ row[column.key] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';

export default {
  name: 'InteractiveDashboard',
  setup() {
    // 响应式数据
    const isLoading = ref(false);
    const selectedPeriod = ref(30);
    const userGrowthChartType = ref('line');
    const appointmentChartView = ref('daily');
    const mapView = ref('users');
    const selectedTable = ref('users');
    const tableSearch = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortColumn = ref('');
    const sortDirection = ref('asc');

    // 图表实例 (暂时注释掉未使用的变量)
    // const charts = ref({});

    // 关键指标数据
    const keyMetrics = ref([
      {
        id: 'totalUsers',
        label: 'Total Users',
        value: 1247,
        change: 12.5,
        trend: 'up',
        icon: 'fas fa-users',
        iconClass: 'blue'
      },
      {
        id: 'appointments',
        label: 'Appointments This Month',
        value: 324,
        change: 8.3,
        trend: 'up',
        icon: 'fas fa-calendar-check',
        iconClass: 'green'
      },
      {
        id: 'emailsSent',
        label: 'Emails Sent',
        value: 2156,
        change: -2.1,
        trend: 'down',
        icon: 'fas fa-envelope',
        iconClass: 'orange'
      },
      {
        id: 'satisfaction',
        label: 'Satisfaction Rate',
        value: 94.2,
        change: 3.7,
        trend: 'up',
        icon: 'fas fa-smile',
        iconClass: 'purple'
      }
    ]);

    // 服务数据
    const serviceData = ref([
      { name: 'Healthcare', value: 45, color: '#FF6384' },
      { name: 'Legal Aid', value: 25, color: '#36A2EB' },
      { name: 'Language Support', value: 20, color: '#FFCE56' },
      { name: 'Social Services', value: 10, color: '#4BC0C0' }
    ]);

    // 用户角色分布
    const roleDistribution = ref([
      { name: 'Immigrants', count: 657, color: '#FF6384' },
      { name: 'Volunteers', count: 423, color: '#36A2EB' },
      { name: 'Staff', count: 89, color: '#FFCE56' },
      { name: 'Admins', count: 78, color: '#4BC0C0' }
    ]);

    // 活动过滤器
    const activityFilters = ref(['appointments', 'registrations', 'emails', 'support']);
    const activeActivityFilters = ref(['appointments', 'registrations']);

    // 模拟实时活动数据
    const realtimeActivities = ref([
      {
        id: 1,
        type: 'appointment',
        icon: 'fas fa-calendar-plus',
        message: 'New appointment booked by John Doe',
        timestamp: new Date(Date.now() - 5 * 60000)
      },
      {
        id: 2,
        type: 'registration',
        icon: 'fas fa-user-plus',
        message: 'Maria Garcia registered as a volunteer',
        timestamp: new Date(Date.now() - 12 * 60000)
      },
      {
        id: 3,
        type: 'email',
        icon: 'fas fa-envelope',
        message: 'Newsletter sent to 250 recipients',
        timestamp: new Date(Date.now() - 18 * 60000)
      },
      {
        id: 4,
        type: 'support',
        icon: 'fas fa-headset',
        message: 'Support ticket resolved for Ahmed Ali',
        timestamp: new Date(Date.now() - 25 * 60000)
      }
    ]);

    // 表格数据
    const tableData = ref({
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'volunteer', status: 'active', joinDate: new Date('2024-01-15') },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'immigrant', status: 'active', joinDate: new Date('2024-01-10') },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', status: 'active', joinDate: new Date('2024-01-08') }
      ],
      appointments: [
        { id: 1, patient: 'John Doe', service: 'Healthcare', date: new Date('2024-02-15'), status: 'confirmed' },
        { id: 2, patient: 'Jane Smith', service: 'Legal Aid', date: new Date('2024-02-16'), status: 'pending' }
      ],
      services: [
        { id: 1, name: 'Healthcare Consultation', usage: 156, satisfaction: 4.8, category: 'medical' },
        { id: 2, name: 'Legal Assistance', usage: 89, satisfaction: 4.6, category: 'legal' }
      ],
      emails: [
        { id: 1, subject: 'Welcome Newsletter', recipients: 250, sent: new Date('2024-02-10'), status: 'delivered' },
        { id: 2, subject: 'Event Announcement', recipients: 180, sent: new Date('2024-02-12'), status: 'delivered' }
      ]
    });

    const tableColumns = ref({
      users: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'role', label: 'Role', type: 'badge' },
        { key: 'status', label: 'Status', type: 'badge' },
        { key: 'joinDate', label: 'Join Date', type: 'date' }
      ],
      appointments: [
        { key: 'patient', label: 'Patient', type: 'text' },
        { key: 'service', label: 'Service', type: 'text' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      services: [
        { key: 'name', label: 'Service Name', type: 'text' },
        { key: 'usage', label: 'Usage Count', type: 'number' },
        { key: 'satisfaction', label: 'Satisfaction', type: 'number' },
        { key: 'category', label: 'Category', type: 'badge' }
      ],
      emails: [
        { key: 'subject', label: 'Subject', type: 'text' },
        { key: 'recipients', label: 'Recipients', type: 'number' },
        { key: 'sent', label: 'Sent Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'badge' }
      ]
    });

    // 计算属性
    const filteredActivities = computed(() => {
      return realtimeActivities.value.filter(activity => 
        activeActivityFilters.value.includes(activity.type)
      );
    });

    const currentTableColumns = computed(() => {
      return tableColumns.value[selectedTable.value] || [];
    });

    const currentTableData = computed(() => {
      let data = tableData.value[selectedTable.value] || [];
      
      // 搜索过滤
      if (tableSearch.value) {
        data = data.filter(row => {
          return Object.values(row).some(value => 
            String(value).toLowerCase().includes(tableSearch.value.toLowerCase())
          );
        });
      }
      
      // 排序
      if (sortColumn.value) {
        data = [...data].sort((a, b) => {
          let aVal = a[sortColumn.value];
          let bVal = b[sortColumn.value];
          
          if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      return data;
    });

    const totalPages = computed(() => {
      return Math.ceil(currentTableData.value.length / itemsPerPage.value);
    });

    const paginatedTableData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return currentTableData.value.slice(start, end);
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

    const formatTime = (date) => {
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const toggleActivityFilter = (filter) => {
      const index = activeActivityFilters.value.indexOf(filter);
      if (index > -1) {
        activeActivityFilters.value.splice(index, 1);
      } else {
        activeActivityFilters.value.push(filter);
      }
    };

    const sortTable = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
      }
      currentPage.value = 1; // 重置到第一页
    };

    const loadTableData = () => {
      currentPage.value = 1;
      tableSearch.value = '';
      sortColumn.value = '';
    };

    const refreshData = async () => {
      isLoading.value = true;
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新关键指标
      keyMetrics.value.forEach(metric => {
        metric.value += Math.floor(Math.random() * 10) - 5;
        metric.change = (Math.random() * 20) - 10;
        metric.trend = metric.change > 0 ? 'up' : 'down';
      });
      
      // 添加新的实时活动
      const newActivity = {
        id: Date.now(),
        type: 'appointment',
        icon: 'fas fa-calendar-plus',
        message: 'Data refreshed successfully',
        timestamp: new Date()
      };
      realtimeActivities.value.unshift(newActivity);
      
      updateCharts();
      isLoading.value = false;
    };

    const updateCharts = () => {
      // 重新绘制所有图表
      nextTick(() => {
        createUserGrowthChart();
        createServiceDistributionChart();
        createAppointmentChart();
        createRoleDistributionChart();
        createPerformanceRadarChart();
        createSparklines();
      });
    };

    const updateAppointmentChart = () => {
      nextTick(() => {
        createAppointmentChart();
      });
    };

    const exportData = () => {
      // 简单的CSV导出
      const csvData = currentTableData.value.map(row => {
        return currentTableColumns.value.map(col => row[col.key]).join(',');
      });
      
      const csvContent = [
        currentTableColumns.value.map(col => col.label).join(','),
        ...csvData
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable.value}_data.csv`;
      a.click();
    };

    // 图表创建方法（使用Canvas API简化实现）
    const createUserGrowthChart = () => {
      const canvas = document.querySelector('[ref="userGrowthChart"]');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 简单的线图绘制
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const data = [10, 15, 12, 20, 18, 25, 30];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * width;
        const y = height - (data[i] / 30) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    };

    const createServiceDistributionChart = () => {
      const canvas = document.querySelector('[ref="serviceDistributionChart"]');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 简单的饼图绘制
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      
      let currentAngle = 0;
      serviceData.value.forEach(service => {
        const sliceAngle = (service.value / 100) * 2 * Math.PI;
        
        ctx.fillStyle = service.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
      });
    };

    const createAppointmentChart = () => {
      const canvas = document.querySelector('[ref="appointmentChart"]');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 简单的柱状图绘制
      const data = [45, 38, 52, 41, 48, 36, 43];
      const barWidth = canvas.width / data.length;
      const maxValue = Math.max(...data);
      
      ctx.fillStyle = '#28a745';
      
      data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (canvas.height - 20);
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
      });
    };

    const createRoleDistributionChart = () => {
      const canvas = document.querySelector('[ref="roleDistributionChart"]');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 简单的环形图绘制
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const outerRadius = Math.min(centerX, centerY) - 20;
      const innerRadius = outerRadius * 0.6;
      
      const total = roleDistribution.value.reduce((sum, role) => sum + role.count, 0);
      let currentAngle = 0;
      
      roleDistribution.value.forEach(role => {
        const sliceAngle = (role.count / total) * 2 * Math.PI;
        
        ctx.fillStyle = role.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
      });
    };

    const createPerformanceRadarChart = () => {
      const canvas = document.querySelector('[ref="performanceRadarChart"]');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 雷达图绘制（简化版）
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 30;
      
      const metrics = ['User Satisfaction', 'Response Time', 'Service Quality', 'Accessibility', 'Efficiency'];
      const currentValues = [85, 78, 92, 88, 76];
      const previousValues = [82, 85, 88, 84, 79];
      
      // 绘制网格
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // 绘制数据
      const drawRadarData = (values, color) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color + '20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        values.forEach((value, index) => {
          const angle = (index / metrics.length) * 2 * Math.PI - Math.PI / 2;
          const r = (value / 100) * radius;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };
      
      drawRadarData(previousValues, '#ff6384');
      drawRadarData(currentValues, '#36a2eb');
    };

    const createSparklines = () => {
      keyMetrics.value.forEach(metric => {
        const canvas = document.querySelector(`[ref="sparkline-${metric.id}"]`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 生成随机趋势数据
        const data = Array.from({ length: 7 }, () => Math.random() * 100);
        
        ctx.strokeStyle = metric.trend === 'up' ? '#28a745' : '#dc3545';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        data.forEach((value, index) => {
          const x = (index / (data.length - 1)) * canvas.width;
          const y = canvas.height - (value / 100) * canvas.height;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      });
    };

    // 生命周期
    onMounted(() => {
      updateCharts();
      
      // 模拟实时数据更新
      setInterval(() => {
        if (Math.random() > 0.7) { // 30% 概率添加新活动
          const activities = ['appointment', 'registration', 'email', 'support'];
          const icons = ['fas fa-calendar-plus', 'fas fa-user-plus', 'fas fa-envelope', 'fas fa-headset'];
          const messages = [
            'New appointment booked',
            'New user registered',
            'Email campaign sent',
            'Support ticket resolved'
          ];
          
          const randomIndex = Math.floor(Math.random() * activities.length);
          const newActivity = {
            id: Date.now(),
            type: activities[randomIndex],
            icon: icons[randomIndex],
            message: messages[randomIndex],
            timestamp: new Date()
          };
          
          realtimeActivities.value.unshift(newActivity);
          
          // 保持最多20条记录
          if (realtimeActivities.value.length > 20) {
            realtimeActivities.value.pop();
          }
        }
      }, 5000);
    });

    return {
      // 响应式数据
      isLoading,
      selectedPeriod,
      userGrowthChartType,
      appointmentChartView,
      mapView,
      selectedTable,
      tableSearch,
      currentPage,
      sortColumn,
      sortDirection,
      keyMetrics,
      serviceData,
      roleDistribution,
      activityFilters,
      activeActivityFilters,
      
      // 计算属性
      filteredActivities,
      currentTableColumns,
      currentTableData,
      totalPages,
      paginatedTableData,
      
      // 方法
      formatNumber,
      formatTime,
      formatDate,
      toggleActivityFilter,
      sortTable,
      loadTableData,
      refreshData,
      updateCharts,
      updateAppointmentChart,
      exportData
    };
  }
};
</script>

<style scoped>
.dashboard {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.dashboard-title i {
  margin-right: 1rem;
  color: #007bff;
}

.dashboard-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.dashboard-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range-picker label {
  font-weight: 500;
  color: #333;
}

.date-range-picker select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.refresh-controls {
  display: flex;
  gap: 1rem;
}

/* 关键指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.metric-icon {
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

.metric-icon.blue { background: linear-gradient(135deg, #007bff, #0056b3); }
.metric-icon.green { background: linear-gradient(135deg, #28a745, #1e7e34); }
.metric-icon.orange { background: linear-gradient(135deg, #fd7e14, #e85d04); }
.metric-icon.purple { background: linear-gradient(135deg, #6f42c1, #5a189a); }

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.metric-label {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-change.up { color: #28a745; }
.metric-change.down { color: #dc3545; }

.metric-chart {
  width: 100px;
  height: 30px;
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.chart-container {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chart-container.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.chart-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.1rem;
}

.chart-controls, .chart-legend, .role-stats, .map-controls, .activity-filters, .performance-legend {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chart-type-btn, .map-view-btn, .filter-btn {
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.chart-type-btn.active, .map-view-btn.active, .filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.current { background: #36a2eb; }
.legend-color.previous { background: #ff6384; }

.role-stat {
  text-align: center;
}

.role-count {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.role-name {
  font-size: 0.8rem;
  color: #666;
}

.chart-content {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heatmap-container {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* 活动流 */
.activity-feed {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: white;
  flex-shrink: 0;
}

.activity-item.appointment .activity-icon { background: #007bff; }
.activity-item.registration .activity-icon { background: #28a745; }
.activity-item.email .activity-icon { background: #fd7e14; }
.activity-item.support .activity-icon { background: #6f42c1; }

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 0.9rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

/* 数据表格 */
.data-table-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-header h3 {
  color: #333;
  margin: 0;
}

.table-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.data-table th:hover {
  background: #e9ecef;
}

.table-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.table-badge.active, .table-badge.confirmed, .table-badge.delivered {
  background: #d4edda;
  color: #155724;
}

.table-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.table-badge.volunteer {
  background: #d1ecf1;
  color: #0c5460;
}

.table-badge.immigrant {
  background: #f8d7da;
  color: #721c24;
}

.table-badge.staff {
  background: #e2e3e5;
  color: #383d41;
}

.table-badge.medical, .table-badge.legal {
  background: #e7f3ff;
  color: #004085;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
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

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
