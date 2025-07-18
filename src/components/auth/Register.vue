<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header d-flex justify-content-center">
          <h3>Create Account</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitForm">
           
            <div class="mb-3">
              <label for="name" class="form-label">Full Name</label>
              <input 
                type="text" 
                class="form-control" 
                id="name"
                v-model="form.name"
                :class="{ 'is-invalid': errors.name }"
                @blur="validateName(true)"  
              >
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
            
            <!-- 邮箱输入框 - 添加 @blur -->
            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control" 
                id="email"
                v-model="form.email"
                :class="{ 'is-invalid': errors.email }"
                @blur="validateEmail(true)"   
              >
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>


            <div class="mb-3">
              <label for="role" class="form-label">How would you like to engage?</label> <!-- 标签文字可调整 -->
              <select 
               class="form-select" 
               id="role" 
               v-model="form.role" 
               :class="{ 'is-invalid': errors.role }"
               @blur="validateRole" >
              <option value="beneficiary">Seeking Help (Immigrant)</option> <!-- 移民角色（受助者） -->
              <option value="volunteer">Volunteer</option> <!-- 志愿者角色 -->
              </select>
              <div class="invalid-feedback">{{ errors.role }}</div> <!-- 角色错误提示 -->
              </div>
            
            <!-- 密码输入框 - 添加 @blur -->
         
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password"
                v-model="form.password"
                :class="{ 'is-invalid': errors.password }"
                @blur="validatePassword"
              >
              <div class="invalid-feedback">{{ errors.password }}</div>
              <!-- 密码强度提示 -->
              <div v-if="passwordStrength.length" class="mt-2">
                <div class="progress" style="height: 5px;">
                  <div 
                    class="progress-bar" 
                    :class="passwordStrengthClass" 
                    role="progressbar" 
                    :style="{ width: passwordStrengthPercent + '%' }"
                  ></div>
                </div>
                <small class="text-muted">{{ passwordStrengthText }}</small>
              </div>
            </div>
            
            <!-- 确认密码输入框 - 添加 @blur -->
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="confirmPassword"
                v-model="form.confirmPassword"
                :class="{ 'is-invalid': errors.confirmPassword }"
                @blur="validateConfirmPassword(true)"  
              >
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
            </div>
            
            <button type="submit" class="btn btn-primary w-100">Register</button>
            
            <div v-if="registerError" class="alert alert-danger mt-3">
              {{ registerError }}
            </div>
          </form>
          
          <div class="mt-3 text-center">
            Already have an account? <router-link to="/login">Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role:''
})
const errors = ref({
  name: null,
  email: null,
  password: null,
  confirmPassword: null,
  role:null
})
const registerError = ref('')

// 密码强度相关状态
const passwordStrength = ref('')
const passwordStrengthPercent = ref(0)
const passwordStrengthClass = ref('')

// 计算密码强度文本
const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return 'Weak password'
    case 'medium': return 'Medium password'
    case 'strong': return 'Strong password!'
    default: return ''
  }
})

// 监听密码变化，实时计算强度
watch(() => form.value.password, (newVal) => {
  calculatePasswordStrength(newVal)
})

// 计算密码强度
const calculatePasswordStrength = (password) => {
  if (!password) {
    passwordStrength.value = ''
    passwordStrengthPercent.value = 0
    return
  }
  
  let strength = 0
  const hasLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
  
  // 加分规则
  if (hasLength) strength += 25
  if (hasUppercase) strength += 25
  if (hasLowercase) strength += 25
  if (hasNumber) strength += 15
  if (hasSpecialChar) strength += 10
  
  // 确保不超过100%
  strength = Math.min(strength, 100)
  
  // 设置进度条百分比
  passwordStrengthPercent.value = strength
  
  // 设置强度级别和样式
  if (strength < 50) {
    passwordStrength.value = 'weak'
    passwordStrengthClass.value = 'bg-danger'
  } else if (strength < 80) {
    passwordStrength.value = 'medium'
    passwordStrengthClass.value = 'bg-warning'
  } else {
    passwordStrength.value = 'strong'
    passwordStrengthClass.value = 'bg-success'
  }
}

// 邮箱格式验证
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// 姓名验证函数
const validateName = () => {
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  } else {
    errors.value.name = null
  }
}

// 邮箱验证函数
const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email is invalid'
  } else {
    errors.value.email = null
  }
}

  // 角色验证函数（失去焦点时调用）
const validateRole = () => {
  if (!form.value.role) { // 若角色未选择
    errors.value.role = 'Please select your role' // 显示错误
  } else {
    errors.value.role = null // 清除错误
  }
}

// 密码验证函数 - 增强版
const validatePassword = () => {
  const password = form.value.password
  
  if (!password) {
    errors.value.password = 'Password is required'
    return
  }
  
  const minLength = 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  
  const errorMessages = []
  
  if (password.length < minLength) {
    errorMessages.push(`at least ${minLength} characters`)
  }
  
  if (!hasUppercase) {
    errorMessages.push('one uppercase letter')
  }
  
  if (!hasLowercase) {
    errorMessages.push('one lowercase letter')
  }
  
  if (errorMessages.length > 0) {
    errors.value.password = `Password must contain: ${errorMessages.join(', ')}`
  } else {
    errors.value.password = null
  }
}

// 确认密码验证函数
const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

// 表单验证函数（提交时使用）
const validateForm = () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateRole()
  
  return !errors.value.name && 
         !errors.value.email && 
         !errors.value.password && 
         !errors.value.confirmPassword &&
         !errors.value.role
}

// 提交表单
const submitForm = async () => {
  if (validateForm()) {
    try {
      const result = await authStore.register({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role
      })
      
      if (result.success) {
        router.push('/')
      } else {
        registerError.value = result.message || 'Registration failed. Please try again.'
      }
    } catch (error) {
      registerError.value = 'An error occurred. Please try again later.'
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.invalid-feedback {
  display: block;
}

/* 密码强度指示器样式 */
.progress {
  background-color: #e9ecef;
  border-radius: 0.25rem;
}
.progress-bar {
  transition: width 0.3s ease;
}
</style>