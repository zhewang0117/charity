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
const isLoading = ref(false);

// Email server configuration
const EMAIL_SERVER_URL = 'http://localhost:3001/send-email';

const handleFileChange = (e) => {
  attachment.value = e.target.files[0];
};

const sendEmail = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  message.value = '';

  try {
    // 准备邮件数据
    const emailData = {
      to: to.value,
      subject: subject.value,
      text: text.value
    };

    // 如果有附件，添加附件处理
    if (attachment.value) {
      // 注意：在浏览器中处理文件附件需要将文件转换为base64
      const fileReader = new FileReader();
      fileReader.onload = async function(e) {
        const base64Content = e.target.result.split(',')[1]; // 移除data:mime;base64,前缀
        
        emailData.attachments = [
          {
            content: base64Content,
            filename: attachment.value.name,
            type: attachment.value.type,
            disposition: 'attachment'
          }
        ];
        
        await sendEmailToServer(emailData);
      };
      fileReader.readAsDataURL(attachment.value);
    } else {
      await sendEmailToServer(emailData);
    }
  } catch (error) {
    console.error('Email preparation error:', error);
    message.value = 'Error preparing email: ' + error.message;
    isLoading.value = false;
  }
};

const sendEmailToServer = async (emailData) => {
  try {
    console.log('Sending email via proxy server:', emailData);
    
    const response = await axios.post(EMAIL_SERVER_URL, emailData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Email server response:', response);

    if (response.data.success) {
      message.value = 'Email sent successfully!';
      // 清空表单
      to.value = '';
      subject.value = '';
      text.value = '';
      attachment.value = null;
      // 清空文件输入框
      const fileInput = document.getElementById('attachment');
      if (fileInput) fileInput.value = '';
    } else {
      message.value = response.data.message || 'Failed to send email. Please try again.';
    }
  } catch (error) {
    console.error('Email server error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request,
      code: error.code
    });
    
    if (error.response) {
      // 服务器响应了错误状态
      const errorMsg = error.response.data?.message || 'Unknown error';
      message.value = `Email Server Error (${error.response.status}): ${errorMsg}`;
    } else if (error.request) {
      // 请求发出但没有收到响应
      message.value = 'Network error: Unable to reach email server. Please make sure the email server is running on port 3001.';
    } else {
      // 请求配置出错
      message.value = 'Request configuration error: ' + error.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mt-5">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail">
      <div class="mb-3">
        <label for="to" class="form-label">To</label>
        <input type="email" class="form-control" id="to" v-model="to" required />
      </div>
      <div class="mb-3">
        <label for="subject" class="form-label">Subject</label>
        <input type="text" class="form-control" id="subject" v-model="subject" required />
      </div>
      <div class="mb-3">
        <label for="text" class="form-label">Body</label>
        <textarea class="form-control" id="text" rows="5" v-model="text" required></textarea>
      </div>
      <div class="mb-3">
        <label for="attachment" class="form-label">Attachment</label>
        <div class="file-upload-wrapper">
          <input type="file" class="form-control d-none" id="attachment" @change="handleFileChange" ref="fileInput" />
          <button type="button" class="btn btn-outline-secondary" @click="$refs.fileInput.click()">
            <i class="fas fa-paperclip"></i>
            Choose File
          </button>
          <span class="ms-2 text-muted" v-if="attachment">{{ attachment.name }}</span>
          <span class="ms-2 text-muted" v-else>No file selected</span>
        </div>
        <div class="form-text">Choose a file to attach to your email</div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <i v-else class="fas fa-paper-plane me-2"></i>
        {{ isLoading ? 'Sending...' : 'Send Email' }}
      </button>
    </form>
    <div v-if="message" class="alert mt-3" :class="{'alert-success': !message.includes('Error'), 'alert-danger': message.includes('Error')}">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.email-sender {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.file-upload-wrapper .btn {
  transition: all 0.3s ease;
}

.file-upload-wrapper .btn:hover {
  background-color: #e9ecef;
  border-color: #6c757d;
}

.file-upload-wrapper .btn i {
  margin-right: 0.5rem;
}
</style>