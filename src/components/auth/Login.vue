<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card">
        <div class="card-header d-flex justify-content-center">
          <h3>Login</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control" 
                id="email"
                v-model="form.email"
                :class="{ 'is-invalid': errors.email }"
              >
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password"
                v-model="form.password"
                :class="{ 'is-invalid': errors.password }"
              >
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            
            <button type="submit" class="btn btn-primary w-100">Login</button>
            
            <div v-if="loginError" class="alert alert-danger mt-3">
              {{ loginError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});
const errors = ref({});
const loginError = ref('');

const validate = () => {
  errors.value = {};
  let isValid = true;
  
  if (!form.value.email) {
    errors.value.email = '邮箱不能为空';
    isValid = false;
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = '邮箱格式不正确';
    isValid = false;
  }
  
  if (!form.value.password) {
    errors.value.password = '密码不能为空';
    isValid = false;
  }
  
  return isValid;
};

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const submitForm = async () => {
  loginError.value = '';
  if (validate()) {
      const result = await authStore.login(form.value.email, form.value.password);
        if (result && result.success) {
        router.push('/');
      } else {
          const code = result?.code ? `(${result.code}) ` : '';
          loginError.value = code + (result?.message || '无效的邮箱或密码');
      }
  }
};
</script>