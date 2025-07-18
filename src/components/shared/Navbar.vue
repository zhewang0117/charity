<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container d-flex align-items-center">
      <router-link class="navbar-brand" to="/">
        <img src="https://via.placeholder.com/150x50.png?text=Logo" alt="Logo" style="height: 40px;">
      </router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              SUPPORT US
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><router-link class="dropdown-item" to="/donate">donate</router-link></li>
              <li><router-link class="dropdown-item" to="/volunteering">volunteering</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Resources</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              GET HELP
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><router-link class="dropdown-item" to="/emergency-help">Emergency Help</router-link></li>
              <li><router-link class="dropdown-item" to="/career-assistance">Career Assistance</router-link></li>
            </ul>
          </li>
          <li class="nav-item" v-if="isAuthenticated && user.role === 'volunteer'">
            <router-link class="nav-link" to="/volunteer-hub">VOLUNTEER HUB</router-link>
          </li>
           <li class="nav-item">
            <router-link class="nav-link" to="/aboutus">ABOUT US</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/volunteers">Volunteers</router-link>
            </li>
            <li class="nav-item">
              <span class="nav-link">Welcome, {{ user.name }}</span>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="logout">Logout</a>
            </li>
          </template>
          <template v-else>
            <div class="d-flex auth-links">
              <li class="nav-item">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/register">Register</router-link>
              </li>
            </div>
          </template>
           <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/profile" title="My Home">&#x1F464;</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
    <div v-if="pageHeader" class="page-header bg-light p-3">
      <h3>{{ pageHeader.title }}</h3>
      <p>{{ pageHeader.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import pageHeaders from '@/assets/page-headers.json'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const pageHeader = ref(null)

watch(
  () => route.name,
  (newName) => {
    if (newName && pageHeaders[newName]) {
      pageHeader.value = pageHeaders[newName]
    } else {
      pageHeader.value = null
    }
  },
  { immediate: true }
)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  min-height: auto; /* Adjust as needed */
  background-size: cover;
  background-position: center;
  padding-top: 0;   /* 去除顶部内边距 */
  padding-bottom: 0;/* 去除底部内边距 */
  align-items: flex-start !important;
  padding: 0.5rem 0; /* 增加上下内边距保持呼吸感 */
}



.navbar-collapse {
  flex-grow: 0;
}


.navbar-nav {
  align-items: center; /* 垂直居中 */
   padding-top: 0 !important; /* 移除顶部内边距 */
}

.auth-links .nav-link {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.dropdown:hover .dropdown-menu {
  display: block;
}

  .navbar-brand {
    margin-right: 8rem !important; /* 增加 logo 与导航项之间的距离 */
  }

  /* 主导航项（SUPPORT US 到 ABOUT US）的间距 */
  .navbar-nav.me-auto .nav-item {
    margin-right: 2rem !important;
  }

  /* 登录注册链接的间距 */
  .auth-links .nav-item {
    margin-right: 1rem !important;
  }

  /* 最后一个导航项去掉右边距，避免超出容器 */
  .nav-item:last-child {
    margin-right: 0 !important;
  }
  
  .nav-link:hover {
    color: #f8f9fa !important; /*  hover 时文字变亮（默认是#fff，可调整） */
    opacity: 0.8; /* 可选：降低透明度，更柔和 */
  }

  .nav-link {
  font-size: 1.1rem !important;  /* 增大字体（默认约1rem） */
}

.container {
  align-items: flex-start !important;
}
</style>