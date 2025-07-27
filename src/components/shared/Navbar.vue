<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <div class="navbar-logo">
            <div class="logo-icon">
              <i class="fas fa-hands-helping"></i>
            </div>
            <div class="logo-text">
              <span class="logo-main">CareNexus</span>
              <span class="logo-sub">a love bridge</span>
            </div>
          </div>
        </router-link>
        <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarNav" :aria-expanded="!isNavbarCollapsed" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['collapse', 'navbar-collapse', { 'show': !isNavbarCollapsed }]" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="supportUsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-hand-holding-heart"></i> SUPPORT US
              </a>
              <ul class="dropdown-menu" aria-labelledby="supportUsDropdown">
                <li><a class="dropdown-item" href="/donate"><i class="fas fa-donate"></i> Donate</a></li>
                <li><a class="dropdown-item" href="/volunteering"><i class="fas fa-people-carry"></i> Volunteer</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-bullhorn"></i> Advocate</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-handshake"></i> Partner</a></li>
              </ul>
            </li>
            <li class="nav-item" v-if="isAuthenticated && user.role === 'beneficiary'">
              <router-link class="nav-link" to="/resources">RESOURCES</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="getHelpDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                GET HELP
              </a>
              <ul class="dropdown-menu" aria-labelledby="getHelpDropdown">
                <li><router-link class="dropdown-item" to="/emergency-help">Emergency Help</router-link></li>
                <li><router-link class="dropdown-item" to="/career-assistance">Career Assistance</router-link></li>
              </ul>
            </li>
            <li class="nav-item" v-if="isAuthenticated && user.role === 'volunteer'">
              <router-link class="nav-link" to="/volunteer-hub">VOLUNTEER HUB</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated && user.role === 'admin'">
              <router-link class="nav-link" to="/admin/activities">Manage Activities</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="aboutUsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ABOUT US
              </a>
              <ul class="dropdown-menu" aria-labelledby="aboutUsDropdown">
                <li><router-link class="dropdown-item" to="/staff">Staff</router-link></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav">
            <template v-if="isAuthenticated">
              <li class="nav-item">
                <span class="nav-link">Welcome, {{ user.name }}</span>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click="logout">Logout</a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/register">Register</router-link>
              </li>
            </template>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/profile"
                title="My Home"
                :class="isAuthenticated ? 'active-profile-icon' : 'disabled-profile-icon'"
                @click.prevent="!isAuthenticated ? preventProfile : null"
              >&#x1F464;</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const preventProfile = () => {

}

const isNavbarCollapsed = ref(true);

const toggleNavbar = () => {
  isNavbarCollapsed.value = !isNavbarCollapsed.value;
};

const handleResize = () => {
  if (window.innerWidth >= 992) { // lg breakpoint
    isNavbarCollapsed.value = true;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Base and Mobile Styles */
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-header {
  padding-top: 80px; /* Adjust based on navbar height */
}

.navbar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #1a73e8 100%);
  color: white;
  font-size: 1.8rem;
  margin-right: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logo-icon:hover {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #1a73e8 0%, #3498db 100%);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-main {
  color: white;
  font-weight: 700;
  font-size: 1.6rem;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.logo-sub {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 2px;
  letter-spacing: 1px;
  word-spacing: 10px;
}

.nav-link {
  color: white !important;
  transition: opacity 0.2s ease-in-out;
}

.nav-link:hover {
  color: #f8f9fa !important;
  opacity: 0.8;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.disabled-profile-icon {
  color: #888 !important;
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.active-profile-icon {
  color: #fff !important;
  opacity: 1;
  pointer-events: auto;
  cursor: pointer;
}


@media (max-width: 575.98px) {
  .navbar-brand .logo-main {
    font-size: 1.1rem;
  }
  .navbar-brand .logo-sub {
    display: none;
  }
  .nav-link, .dropdown-toggle {
    font-size: 0.95rem !important;
    padding: 0.5rem 0.7rem !important;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .navbar-brand .logo-main {
    font-size: 1.2rem;
  }
  .navbar-brand .logo-sub {
    font-size: 0.7rem;
  }
  .nav-link, .dropdown-toggle {
    font-size: 1rem !important;
    padding: 0.5rem 0.9rem !important;
  }
}


@media (min-width: 768px) and (max-width: 991.98px) {
  .navbar-brand .logo-main {
    font-size: 1.3rem;
  }
  .navbar-brand .logo-sub {
    font-size: 0.8rem;
  }
  .nav-link, .dropdown-toggle {
    font-size: 1.05rem !important;
    padding: 0.5rem 1rem !important;
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .navbar-collapse {
    display: flex !important;
    justify-content: space-between;
  }
  
  .navbar-nav {
    align-items: center;
  }
  
  .navbar-brand {
    margin-right: 0.6rem !important; 
    flex-shrink: 0;
    font-size: 0.95rem !important; 
  }
  
  .navbar-nav.me-auto .nav-item {
    margin-right: 0.3rem; 
  }
  
  .nav-link {
    padding: 0.25rem 0.4rem !important; 
    font-size: 0.85rem !important; 
    white-space: nowrap;
  }
  
  .navbar-nav:not(.me-auto) {
    flex-shrink: 1;
    max-width: 40%; 
  }
  
 
  .nav-link i + span,
  .nav-link span {
    display: none;
  }
  
  
  .nav-link i {
    font-size: 0.9rem; 
  }
}

@media (min-width: 1200px) and (max-width: 1399.98px) {
  .navbar-collapse {
    display: flex !important;
    justify-content: space-between;
  }
  .navbar-nav {
    align-items: center;
  }
  .navbar-brand {
    margin-right: 2rem !important;
    flex-shrink: 0;
  }
  .navbar-nav.me-auto .nav-item {
    margin-right: 0.34rem;
  }
  .nav-link {
    padding: 0.5rem 1.1rem !important;
    font-size: 0.9rem !important;
    white-space: nowrap;
  }
  .navbar-nav:not(.me-auto) {
    flex-shrink: 0;
  }
}


@media (min-width: 1400px) {
  .navbar-brand {
    margin-right: 4rem !important;
  }
  .navbar-nav.me-auto .nav-item {
    margin-right: 0.6rem;
  }
  .nav-link {
    padding: 0.5rem 1.5rem !important;
    font-size: 1.05rem !important;
  }
}

.navbar-collapse.show {
  background-color: rgba(255, 255, 255, 0.97);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

.navbar-collapse.show .navbar-nav .nav-link,
.navbar-collapse.show .navbar-nav .dropdown-toggle {
  color: #333 !important;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease-in-out;
}

.navbar-collapse.show .navbar-nav .nav-link:hover,
.navbar-collapse.show .navbar-nav .dropdown-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.navbar-collapse.show .dropdown-menu {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.navbar-collapse.show .dropdown-item {
  color: #333 !important;
  padding-left: 2rem;
}

</style>