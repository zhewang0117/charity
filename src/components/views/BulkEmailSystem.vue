<template>
  <div class="bulk-email-system">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-envelope-open-text"></i>
          Bulk Email System
        </h1>
        <p class="page-subtitle">Send newsletters and announcements to multiple recipients</p>
      </div>

      <!-- 功能选项卡 -->
      <div class="feature-tabs">
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'compose' }"
          @click="activeTab = 'compose'"
        >
          <i class="fas fa-edit"></i>
          Compose Email
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'templates' }"
          @click="activeTab = 'templates'"
        >
          <i class="fas fa-file-alt"></i>
          Templates
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'recipients' }"
          @click="activeTab = 'recipients'"
        >
          <i class="fas fa-users"></i>
          Recipients
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <i class="fas fa-history"></i>
          Email History
        </button>
      </div>

      <!-- 撰写邮件 -->
      <div v-if="activeTab === 'compose'" class="compose-section">
        <div class="compose-container">
          <div class="email-form">
            <div class="form-group">
              <label for="emailSubject">Subject *</label>
              <input 
                type="text" 
                id="emailSubject" 
                v-model="emailForm.subject" 
                class="form-control"
                placeholder="Enter email subject..."
                required
              >
            </div>

            <div class="form-group">
              <label for="emailTemplate">Template</label>
              <select 
                id="emailTemplate" 
                v-model="emailForm.template"
                @change="applyTemplate"
                class="form-control"
              >
                <option value="">Select a template...</option>
                <option 
                  v-for="template in emailTemplates" 
                  :key="template.id" 
                  :value="template.id"
                >
                  {{ template.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="emailMessage">Message *</label>
              <div class="editor-toolbar">
                <button type="button" @click="formatText('bold')" class="format-btn">
                  <i class="fas fa-bold"></i>
                </button>
                <button type="button" @click="formatText('italic')" class="format-btn">
                  <i class="fas fa-italic"></i>
                </button>
                <button type="button" @click="formatText('underline')" class="format-btn">
                  <i class="fas fa-underline"></i>
                </button>
                <button type="button" @click="insertVariable('name')" class="variable-btn">
                  {name}
                </button>
                <button type="button" @click="insertVariable('email')" class="variable-btn">
                  {email}
                </button>
                <button type="button" @click="insertVariable('date')" class="variable-btn">
                  {date}
                </button>
              </div>
              <textarea 
                id="emailMessage" 
                v-model="emailForm.message" 
                class="form-control message-editor"
                rows="10"
                placeholder="Compose your message... Use {name}, {email}, {date} for personalization"
                required
                ref="messageEditor"
              ></textarea>
            </div>

            <div class="recipient-selection">
              <h4>Select Recipients</h4>
              <div class="recipient-options">
                <div class="option-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="emailForm.sendToAll">
                    <span class="checkmark"></span>
                    Send to All Users ({{ totalUsers }} recipients)
                  </label>
                </div>
                <div class="option-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="emailForm.sendToVolunteers">
                    <span class="checkmark"></span>
                    Send to Volunteers ({{ volunteerCount }} recipients)
                  </label>
                </div>
                <div class="option-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="emailForm.sendToImmigrants">
                    <span class="checkmark"></span>
                    Send to Immigrants ({{ immigrantCount }} recipients)
                  </label>
                </div>
                <div class="option-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="emailForm.sendToStaff">
                    <span class="checkmark"></span>
                    Send to Staff ({{ staffCount }} recipients)
                  </label>
                </div>
              </div>

              <!-- 自定义收件人列表 -->
              <div class="custom-recipients">
                <h5>Custom Recipients</h5>
                <div class="recipient-input">
                  <input 
                    type="email" 
                    v-model="newRecipientEmail"
                    placeholder="Enter email address..."
                    class="form-control"
                    @keypress.enter="addCustomRecipient"
                  >
                  <input 
                    type="text" 
                    v-model="newRecipientName"
                    placeholder="Name (optional)"
                    class="form-control"
                  >
                  <button @click="addCustomRecipient" class="btn btn-secondary">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                
                <div v-if="emailForm.customRecipients.length" class="recipient-list">
                  <div 
                    v-for="(recipient, index) in emailForm.customRecipients" 
                    :key="index"
                    class="recipient-item"
                  >
                    <span>{{ recipient.name || recipient.email }}</span>
                    <small>{{ recipient.email }}</small>
                    <button @click="removeCustomRecipient(index)" class="remove-btn">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 邮件预览 -->
            <div class="email-preview">
              <h4>Email Preview</h4>
              <div class="preview-container">
                <div class="preview-header">
                  <strong>Subject:</strong> {{ emailForm.subject || 'No subject' }}
                </div>
                <div class="preview-body" v-html="getPreviewContent()"></div>
              </div>
            </div>

            <!-- 发送选项 -->
            <div class="send-options">
              <div class="schedule-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="emailForm.scheduleEmail">
                  <span class="checkmark"></span>
                  Schedule for later
                </label>
                <div v-if="emailForm.scheduleEmail" class="schedule-datetime">
                  <input 
                    type="datetime-local" 
                    v-model="emailForm.scheduledTime"
                    class="form-control"
                  >
                </div>
              </div>
            </div>

            <!-- 发送按钮 -->
            <div class="form-actions">
              <button 
                @click="sendBulkEmail" 
                class="btn btn-primary"
                :disabled="!canSendEmail || isSending"
              >
                <i class="fas fa-paper-plane" v-if="!isSending"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                {{ isSending ? 'Sending...' : (emailForm.scheduleEmail ? 'Schedule Email' : 'Send Now') }}
              </button>
              <button @click="saveAsDraft" class="btn btn-secondary">
                <i class="fas fa-save"></i>
                Save as Draft
              </button>
              <button @click="resetForm" class="btn btn-outline">
                <i class="fas fa-redo"></i>
                Reset
              </button>
            </div>
          </div>

          <!-- 发送统计 -->
          <div class="sending-stats">
            <h4>Sending Statistics</h4>
            <div class="stat-item">
              <span class="stat-label">Total Recipients:</span>
              <span class="stat-value">{{ getTotalRecipients() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Estimated Cost:</span>
              <span class="stat-value">${{ (getTotalRecipients() * 0.01).toFixed(2) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Character Count:</span>
              <span class="stat-value">{{ emailForm.message.length }}/5000</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 邮件模板 -->
      <div v-if="activeTab === 'templates'" class="templates-section">
        <div class="templates-header">
          <h3>Email Templates</h3>
          <button @click="showCreateTemplate = true" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Create Template
          </button>
        </div>

        <div class="templates-grid">
          <div 
            v-for="template in emailTemplates" 
            :key="template.id"
            class="template-card"
          >
            <div class="template-preview">
              <h4>{{ template.name }}</h4>
              <p>{{ template.description }}</p>
              <div class="template-content">{{ template.content.substring(0, 100) }}...</div>
            </div>
            <div class="template-actions">
              <button @click="useTemplate(template)" class="btn btn-secondary">
                <i class="fas fa-edit"></i>
                Use Template
              </button>
              <button @click="editTemplate(template)" class="btn btn-outline">
                <i class="fas fa-pencil-alt"></i>
                Edit
              </button>
              <button @click="deleteTemplate(template.id)" class="btn btn-danger">
                <i class="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- 创建模板模态框 -->
        <div v-if="showCreateTemplate" class="modal-overlay">
          <div class="modal-content">
            <h3>Create Email Template</h3>
            <form @submit.prevent="createTemplate">
              <div class="form-group">
                <label>Template Name</label>
                <input type="text" v-model="newTemplate.name" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Description</label>
                <input type="text" v-model="newTemplate.description" class="form-control">
              </div>
              <div class="form-group">
                <label>Content</label>
                <textarea v-model="newTemplate.content" class="form-control" rows="6" required></textarea>
              </div>
              <div class="modal-actions">
                <button type="submit" class="btn btn-primary">Create Template</button>
                <button type="button" @click="showCreateTemplate = false" class="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 收件人管理 -->
      <div v-if="activeTab === 'recipients'" class="recipients-section">
        <div class="recipients-header">
          <h3>Recipient Management</h3>
          <button @click="importRecipients" class="btn btn-primary">
            <i class="fas fa-upload"></i>
            Import Recipients
          </button>
        </div>

        <div class="recipients-stats">
          <div class="stat-card">
            <i class="fas fa-users"></i>
            <div class="stat-info">
              <h4>{{ totalUsers }}</h4>
              <p>Total Users</p>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-hands-helping"></i>
            <div class="stat-info">
              <h4>{{ volunteerCount }}</h4>
              <p>Volunteers</p>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-globe"></i>
            <div class="stat-info">
              <h4>{{ immigrantCount }}</h4>
              <p>Immigrants</p>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-user-tie"></i>
            <div class="stat-info">
              <h4>{{ staffCount }}</h4>
              <p>Staff</p>
            </div>
          </div>
        </div>

        <!-- 收件人列表 -->
        <div class="recipients-table">
          <div class="table-header">
            <input type="text" v-model="recipientSearch" placeholder="Search recipients..." class="search-input">
            <select v-model="recipientFilter" class="filter-select">
              <option value="">All Roles</option>
              <option value="volunteer">Volunteers</option>
              <option value="immigrant">Immigrants</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          
          <div class="table-content">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" @change="toggleSelectAll" :checked="allSelected">
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="recipient in filteredRecipients" :key="recipient.id">
                  <td>
                    <input type="checkbox" v-model="selectedRecipients" :value="recipient.id">
                  </td>
                  <td>{{ recipient.name }}</td>
                  <td>{{ recipient.email }}</td>
                  <td>
                    <span class="role-badge" :class="recipient.role">{{ recipient.role }}</span>
                  </td>
                  <td>
                    <span class="status-badge" :class="recipient.emailStatus">{{ recipient.emailStatus }}</span>
                  </td>
                  <td>
                    <button @click="viewRecipient(recipient)" class="btn-icon">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editRecipient(recipient)" class="btn-icon">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 邮件历史 -->
      <div v-if="activeTab === 'history'" class="history-section">
        <div class="history-header">
          <h3>Email History</h3>
          <div class="history-filters">
            <select v-model="historyFilter" class="filter-select">
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <input type="date" v-model="historyDateFilter" class="date-filter">
          </div>
        </div>

        <div class="history-list">
          <div 
            v-for="email in filteredEmailHistory" 
            :key="email.id"
            class="history-item"
          >
            <div class="email-info">
              <h4>{{ email.subject }}</h4>
              <p>{{ email.message.substring(0, 100) }}...</p>
              <div class="email-meta">
                <span><i class="fas fa-calendar"></i> {{ formatDate(email.createdAt) }}</span>
                <span><i class="fas fa-users"></i> {{ email.totalRecipients }} recipients</span>
                <span class="status-badge" :class="email.status">{{ email.status }}</span>
              </div>
            </div>
            <div class="email-actions">
              <button @click="viewEmailDetails(email)" class="btn btn-secondary">
                <i class="fas fa-eye"></i>
                View Details
              </button>
              <button @click="resendEmail(email)" class="btn btn-outline">
                <i class="fas fa-redo"></i>
                Resend
              </button>
              <button @click="deleteEmail(email.id)" class="btn btn-danger">
                <i class="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 成功/错误消息 -->
      <div v-if="showMessage" class="message-toast" :class="messageType">
        <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ message }}
        <button @click="showMessage = false" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export default {
  name: 'BulkEmailSystem',
  setup() {
    // 响应式数据
    const activeTab = ref('compose');
    const isSending = ref(false);
    const showCreateTemplate = ref(false);
    const showMessage = ref(false);
    const message = ref('');
    const messageType = ref('success');

    // 邮件表单
    const emailForm = ref({
      subject: '',
      message: '',
      template: '',
      sendToAll: false,
      sendToVolunteers: false,
      sendToImmigrants: false,
      sendToStaff: false,
      customRecipients: [],
      scheduleEmail: false,
      scheduledTime: ''
    });

    // 新收件人
    const newRecipientEmail = ref('');
    const newRecipientName = ref('');

    // 模板相关
    const newTemplate = ref({
      name: '',
      description: '',
      content: ''
    });

    const emailTemplates = ref([
      {
        id: 1,
        name: 'Welcome Email',
        description: 'Welcome new users to the platform',
        content: `Dear {name},

Welcome to CareNexus! We're excited to have you join our community.

Our platform provides comprehensive support for immigrants, including:
- Healthcare resources and consultations
- Legal assistance and guidance
- Community support and networking
- Volunteer opportunities

If you have any questions, please don't hesitate to reach out.

Best regards,
The CareNexus Team`
      },
      {
        id: 2,
        name: 'Event Announcement',
        description: 'Announce upcoming events and activities',
        content: `Hello {name},

We have an exciting announcement about upcoming events at CareNexus!

[Event Details Here]

We hope to see you there. Please RSVP by clicking the link below.

Thank you,
CareNexus Events Team`
      },
      {
        id: 3,
        name: 'Newsletter',
        description: 'Monthly newsletter template',
        content: `Dear {name},

Welcome to this month's CareNexus newsletter!

HIGHLIGHTS:
- New services available
- Success stories from our community
- Upcoming events and workshops

Thank you for being part of our community.

Best wishes,
CareNexus Team`
      }
    ]);

    // 用户数据（模拟）
    const users = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'volunteer', emailStatus: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'immigrant', emailStatus: 'active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', emailStatus: 'active' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'volunteer', emailStatus: 'bounced' },
      { id: 5, name: 'David Brown', email: 'david@example.com', role: 'immigrant', emailStatus: 'active' }
    ]);

    // 邮件历史（模拟）
    const emailHistory = ref([
      {
        id: 1,
        subject: 'Welcome to CareNexus',
        message: 'Welcome email content...',
        totalRecipients: 25,
        status: 'sent',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        subject: 'Monthly Newsletter - January',
        message: 'Newsletter content...',
        totalRecipients: 150,
        status: 'sent',
        createdAt: new Date('2024-01-10')
      }
    ]);

    // 搜索和过滤
    const recipientSearch = ref('');
    const recipientFilter = ref('');
    const historyFilter = ref('');
    const historyDateFilter = ref('');
    const selectedRecipients = ref([]);

    // 计算属性
    const totalUsers = computed(() => users.value.length);
    const volunteerCount = computed(() => users.value.filter(u => u.role === 'volunteer').length);
    const immigrantCount = computed(() => users.value.filter(u => u.role === 'immigrant').length);
    const staffCount = computed(() => users.value.filter(u => u.role === 'staff').length);

    const filteredRecipients = computed(() => {
      let filtered = users.value;
      
      if (recipientSearch.value) {
        filtered = filtered.filter(u => 
          u.name.toLowerCase().includes(recipientSearch.value.toLowerCase()) ||
          u.email.toLowerCase().includes(recipientSearch.value.toLowerCase())
        );
      }
      
      if (recipientFilter.value) {
        filtered = filtered.filter(u => u.role === recipientFilter.value);
      }
      
      return filtered;
    });

    const filteredEmailHistory = computed(() => {
      let filtered = emailHistory.value;
      
      if (historyFilter.value) {
        filtered = filtered.filter(e => e.status === historyFilter.value);
      }
      
      if (historyDateFilter.value) {
        const filterDate = new Date(historyDateFilter.value);
        filtered = filtered.filter(e => 
          e.createdAt.toDateString() === filterDate.toDateString()
        );
      }
      
      return filtered;
    });

    const canSendEmail = computed(() => {
      return emailForm.value.subject && 
             emailForm.value.message && 
             getTotalRecipients() > 0;
    });

    const allSelected = computed(() => {
      return selectedRecipients.value.length === filteredRecipients.value.length;
    });

    // 方法
    const getTotalRecipients = () => {
      let count = 0;
      
      if (emailForm.value.sendToAll) count += totalUsers.value;
      else {
        if (emailForm.value.sendToVolunteers) count += volunteerCount.value;
        if (emailForm.value.sendToImmigrants) count += immigrantCount.value;
        if (emailForm.value.sendToStaff) count += staffCount.value;
      }
      
      count += emailForm.value.customRecipients.length;
      
      return count;
    };

    const getPreviewContent = () => {
      return emailForm.value.message
        .replace(/\{name\}/g, '<strong>[Name]</strong>')
        .replace(/\{email\}/g, '<strong>[Email]</strong>')
        .replace(/\{date\}/g, '<strong>[Date]</strong>')
        .replace(/\n/g, '<br>');
    };

    const applyTemplate = () => {
      const template = emailTemplates.value.find(t => t.id == emailForm.value.template);
      if (template) {
        emailForm.value.message = template.content;
        if (!emailForm.value.subject) {
          emailForm.value.subject = template.name;
        }
      }
    };

    const formatText = (command) => {
      // 简单的文本格式化（实际实现需要更复杂的逻辑）
      document.execCommand(command, false, null);
    };

    const insertVariable = (variable) => {
      const textarea = document.getElementById('emailMessage');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = emailForm.value.message;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      emailForm.value.message = before + `{${variable}}` + after;
    };

    const addCustomRecipient = () => {
      if (newRecipientEmail.value) {
        emailForm.value.customRecipients.push({
          email: newRecipientEmail.value,
          name: newRecipientName.value
        });
        newRecipientEmail.value = '';
        newRecipientName.value = '';
      }
    };

    const removeCustomRecipient = (index) => {
      emailForm.value.customRecipients.splice(index, 1);
    };

    const sendBulkEmail = async () => {
      if (!canSendEmail.value) return;
      
      isSending.value = true;
      
      try {
        // 准备收件人列表
        const recipients = [];
        
        if (emailForm.value.sendToAll) {
          users.value.forEach(user => {
            recipients.push({ email: user.email, name: user.name });
          });
        } else {
          if (emailForm.value.sendToVolunteers) {
            users.value.filter(u => u.role === 'volunteer').forEach(user => {
              recipients.push({ email: user.email, name: user.name });
            });
          }
          if (emailForm.value.sendToImmigrants) {
            users.value.filter(u => u.role === 'immigrant').forEach(user => {
              recipients.push({ email: user.email, name: user.name });
            });
          }
          if (emailForm.value.sendToStaff) {
            users.value.filter(u => u.role === 'staff').forEach(user => {
              recipients.push({ email: user.email, name: user.name });
            });
          }
        }
        
        // 添加自定义收件人
        emailForm.value.customRecipients.forEach(recipient => {
          recipients.push(recipient);
        });

        // 调用云函数发送邮件
        const sendBulkEmailFunc = httpsCallable(functions, 'sendBulkEmail');
        const result = await sendBulkEmailFunc({
          recipients,
          subject: emailForm.value.subject,
          message: emailForm.value.message,
          template: emailForm.value.template
        });

        if (result.data.success) {
          showNotification('Bulk email sent successfully!', 'success');
          
          // 添加到历史记录
          emailHistory.value.unshift({
            id: Date.now(),
            subject: emailForm.value.subject,
            message: emailForm.value.message,
            totalRecipients: recipients.length,
            status: 'sent',
            createdAt: new Date()
          });
          
          resetForm();
        } else {
          showNotification('Failed to send bulk email: ' + result.data.message, 'error');
        }
      } catch (error) {
        console.error('Bulk email error:', error);
        showNotification('Failed to send bulk email. Please try again.', 'error');
      } finally {
        isSending.value = false;
      }
    };

    const saveAsDraft = () => {
      // 保存草稿逻辑
      showNotification('Email saved as draft', 'success');
    };

    const resetForm = () => {
      emailForm.value = {
        subject: '',
        message: '',
        template: '',
        sendToAll: false,
        sendToVolunteers: false,
        sendToImmigrants: false,
        sendToStaff: false,
        customRecipients: [],
        scheduleEmail: false,
        scheduledTime: ''
      };
    };

    const useTemplate = (template) => {
      emailForm.value.template = template.id;
      applyTemplate();
      activeTab.value = 'compose';
    };

    const createTemplate = () => {
      const newId = Math.max(...emailTemplates.value.map(t => t.id)) + 1;
      emailTemplates.value.push({
        id: newId,
        ...newTemplate.value
      });
      
      newTemplate.value = { name: '', description: '', content: '' };
      showCreateTemplate.value = false;
      showNotification('Template created successfully!', 'success');
    };

    const deleteTemplate = (id) => {
      if (confirm('Are you sure you want to delete this template?')) {
        emailTemplates.value = emailTemplates.value.filter(t => t.id !== id);
        showNotification('Template deleted', 'success');
      }
    };

    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedRecipients.value = [];
      } else {
        selectedRecipients.value = filteredRecipients.value.map(r => r.id);
      }
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const showNotification = (msg, type) => {
      message.value = msg;
      messageType.value = type;
      showMessage.value = true;
      setTimeout(() => {
        showMessage.value = false;
      }, 5000);
    };

    const viewEmailDetails = (email) => {
      // 查看邮件详情
      console.log('View email details:', email);
    };

    const resendEmail = (email) => {
      // 重新发送邮件
      console.log('Resend email:', email);
    };

    const deleteEmail = (id) => {
      if (confirm('Are you sure you want to delete this email?')) {
        emailHistory.value = emailHistory.value.filter(e => e.id !== id);
        showNotification('Email deleted', 'success');
      }
    };

    return {
      // 响应式数据
      activeTab,
      isSending,
      showCreateTemplate,
      showMessage,
      message,
      messageType,
      emailForm,
      newRecipientEmail,
      newRecipientName,
      newTemplate,
      emailTemplates,
      users,
      emailHistory,
      recipientSearch,
      recipientFilter,
      historyFilter,
      historyDateFilter,
      selectedRecipients,
      
      // 计算属性
      totalUsers,
      volunteerCount,
      immigrantCount,
      staffCount,
      filteredRecipients,
      filteredEmailHistory,
      canSendEmail,
      allSelected,
      
      // 方法
      getTotalRecipients,
      getPreviewContent,
      applyTemplate,
      formatText,
      insertVariable,
      addCustomRecipient,
      removeCustomRecipient,
      sendBulkEmail,
      saveAsDraft,
      resetForm,
      useTemplate,
      createTemplate,
      deleteTemplate,
      toggleSelectAll,
      formatDate,
      showNotification,
      viewEmailDetails,
      resendEmail,
      deleteEmail
    };
  }
};
</script>

<style scoped>
.bulk-email-system {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-title i {
  margin-right: 1rem;
  color: #007bff;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
}

/* 选项卡 */
.feature-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  background: white;
  border-radius: 15px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #007bff;
}

.tab-button.active {
  background: #007bff;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
}

/* 撰写邮件 */
.compose-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.compose-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.message-editor {
  min-height: 200px;
  resize: vertical;
}

/* 编辑器工具栏 */
.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.format-btn, .variable-btn {
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.format-btn:hover, .variable-btn:hover {
  background: #e9ecef;
}

.variable-btn {
  font-size: 0.8rem;
  font-weight: 500;
  color: #007bff;
}

/* 收件人选择 */
.recipient-selection {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.recipient-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.75rem;
  transform: scale(1.2);
}

.custom-recipients h5 {
  margin-bottom: 1rem;
  color: #333;
}

.recipient-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.recipient-input .form-control {
  flex: 1;
}

.recipient-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recipient-item {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recipient-item small {
  color: #666;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 0.7rem;
}

/* 邮件预览 */
.email-preview {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.preview-container {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  padding: 1rem;
  background: #e9ecef;
  border-bottom: 1px solid #ddd;
}

.preview-body {
  padding: 1.5rem;
  min-height: 100px;
}

/* 发送选项 */
.send-options {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.schedule-datetime {
  margin-top: 1rem;
}

/* 发送统计 */
.sending-stats {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.sending-stats h4 {
  margin-bottom: 1rem;
  color: #333;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

/* 模板相关 */
.templates-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.template-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  transition: transform 0.3s ease;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.template-preview h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.template-preview p {
  color: #666;
  margin-bottom: 1rem;
}

.template-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.template-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 收件人管理 */
.recipients-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.recipients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.recipients-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-info h4 {
  font-size: 2rem;
  margin: 0;
}

.stat-info p {
  margin: 0;
  opacity: 0.9;
}

/* 表格样式 */
.recipients-table {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.search-input, .filter-select, .date-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.table-content {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.role-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-badge.volunteer {
  background: #d4edda;
  color: #155724;
}

.role-badge.immigrant {
  background: #d1ecf1;
  color: #0c5460;
}

.role-badge.staff {
  background: #fff3cd;
  color: #856404;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.bounced {
  background: #f8d7da;
  color: #721c24;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  margin: 0 0.25rem;
}

.btn-icon:hover {
  background: #f8f9fa;
  color: #007bff;
}

/* 邮件历史 */
.history-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.history-filters {
  display: flex;
  gap: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.email-info h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.email-info p {
  color: #666;
  margin-bottom: 1rem;
}

.email-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.email-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.email-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* 消息提示 */
.message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1001;
  transition: all 0.3s ease;
}

.message-toast.success {
  background: #28a745;
}

.message-toast.error {
  background: #dc3545;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .compose-container {
    grid-template-columns: 1fr;
  }
  
  .feature-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    padding: 0.75rem 1rem;
  }
  
  .recipients-stats {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .email-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
