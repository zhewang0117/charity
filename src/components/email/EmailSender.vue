<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

onMounted(() => {
  console.log('EmailSender.vue component has been mounted.');
});

const to = ref('');
const subject = ref('');
const text = ref('');
const attachment = ref(null);
const message = ref('');
const loading = ref(false);

const handleFileChange = (e) => {
  attachment.value = e.target.files[0];
};

const sendEmail = async () => {
  if (!to.value || !subject.value || !text.value) {
    message.value = 'Please fill in all required fields.';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    // 使用我们的 email-server 代理发送邮件
    const response = await axios.post('http://localhost:3001/send-email', {
      to: to.value,
      subject: subject.value,
      text: text.value
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    message.value = 'Email sent successfully!';
    to.value = '';
    subject.value = '';
    text.value = '';
    attachment.value = null;
    document.getElementById('attachment').value = null;
  } catch (error) {
    console.error('Email sending error:', error);
    message.value = error.response?.data?.error || 'Error sending email. Please check if the email server is running.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="email-sender">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="email-card">
            <div class="email-header">
              <i class="fas fa-envelope"></i>
              <h2>Send Email</h2>
              <p>Compose and send emails through CareNexus</p>
            </div>
            
            <div class="email-form">
              <form @submit.prevent="sendEmail">
                <div class="form-group">
                  <label for="to" class="form-label">
                    <i class="fas fa-user"></i>
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    id="to"
                    v-model="to"
                    class="form-control"
                    placeholder="Enter recipient's email address"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="subject" class="form-label">
                    <i class="fas fa-tag"></i>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    v-model="subject"
                    class="form-control"
                    placeholder="Enter email subject"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="text" class="form-label">
                    <i class="fas fa-edit"></i>
                    Message *
                  </label>
                  <textarea
                    id="text"
                    v-model="text"
                    class="form-control"
                    rows="8"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="attachment" class="form-label">
                    <i class="fas fa-paperclip"></i>
                    Attachment (Optional)
                  </label>
                  <div class="file-input-wrapper">
                    <input
                      type="file"
                      id="attachment"
                      @change="handleFileChange"
                      class="file-input"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    >
                    <label for="attachment" class="file-input-label">
                      <i class="fas fa-cloud-upload-alt"></i>
                      Choose File
                    </label>
                    <span class="file-name" v-if="attachment">
                      {{ attachment.name }}
                    </span>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <i class="fas fa-paper-plane" v-if="!loading"></i>
                    <i class="fas fa-spinner fa-spin" v-if="loading"></i>
                    {{ loading ? 'Sending...' : 'Send Email' }}
                  </button>
                </div>

                <div v-if="message" class="alert" :class="message.includes('Error') ? 'alert-danger' : 'alert-success'">
                  <i class="fas fa-check-circle" v-if="!message.includes('Error')"></i>
                  <i class="fas fa-exclamation-triangle" v-if="message.includes('Error')"></i>
                  {{ message }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-sender {
  min-height: 100vh;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  padding: 2rem 0;
}

.email-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 2rem 0;
}

.email-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
}

.email-header i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: hsla(160, 100%, 37%, 1);
}

.email-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.email-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.email-form {
  padding: 3rem 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label i {
  color: #007bff;
  width: 16px;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  background: white;
}

.form-control::placeholder {
  color: #6c757d;
}

textarea.form-control {
  resize: vertical;
  min-height: 150px;
}

.file-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
}

.file-input-label:hover {
  background: #e9ecef;
  border-color: #007bff;
  color: #007bff;
}

.file-name {
  color: #28a745;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-actions {
  text-align: center;
  margin-top: 3rem;
}

.btn {
  padding: 1rem 3rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.alert {
  padding: 1.25rem;
  border-radius: 12px;
  border: none;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.alert-success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
}

.alert-danger {
  background: linear-gradient(135deg, #f8d7da, #f1aeb5);
  color: #721c24;
}

.alert i {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .email-sender {
    padding: 1rem 0;
  }
  
  .email-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .email-header h2 {
    font-size: 2rem;
  }
  
  .email-form {
    padding: 2rem 1.5rem;
  }
  
  .btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
</style>