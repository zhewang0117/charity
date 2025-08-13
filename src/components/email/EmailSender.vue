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

const handleFileChange = (e) => {
  attachment.value = e.target.files[0];
};

const sendEmail = async () => {
  const formData = new FormData();
  formData.append('to', to.value);
  formData.append('subject', subject.value);
  formData.append('text', text.value);
  if (attachment.value) {
    formData.append('attachment', attachment.value);
  }

  try {
    const response = await axios.post('http://localhost:3000/send-email', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    message.value = response.data;
    to.value = '';
    subject.value = '';
    text.value = '';
    attachment.value = null;
    document.getElementById('attachment').value = null;
  } catch (error) {
    message.value = 'Error sending email';
    console.error(error);
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
        <input type="file" class="form-control" id="attachment" @change="handleFileChange" />
      </div>
      <button type="submit" class="btn btn-primary">Send</button>
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
</style>