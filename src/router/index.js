import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/views/HomePage.vue')
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/components/views/ResourcesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/food-service',
    name: 'food-service',
    component: () => import('@/components/views/FoodService.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/housing-service',
    name: 'housing-service',
    component: () => import('@/components/views/HousingService.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/medical-service',
    name: 'medical-service',
    component: () => import('@/components/views/MedicalService.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/community',
  //   name: 'community',
  //   component: () => import('@/components/views/CommunityPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: () => import('@/components/views/AdminDashboard.vue'),
  //   meta: { requiresAuth: true, requiredRole: 'admin' }
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/auth/Register.vue')
  },
  {
    path: '/aboutus',
    name: 'aboutus',
    component: () => import('@/components/views/AboutUs.vue')
  },
  {
    path: '/donate',
    name: 'donate',
    component: () => import('@/components/views/Donate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/volunteering',
    name: 'volunteering',
    component: () => import('@/components/views/Volunteering.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/emergency-help',
    name: 'emergency-help',
    component: () => import('@/components/views/EmergencyHelp.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/career-assistance',
    name: 'career-assistance',
    component: () => import('@/components/views/CareerAssistance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/volunteer-hub',
    name: 'volunteer-hub',
    component: () => import('@/components/views/VolunteerHub.vue'),
    meta: { requiresAuth: true, requiredRole: 'volunteer' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/components/views/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: () => import('@/components/views/EditProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/volunteers',
    name: 'volunteers',
    component: () => import('@/components/views/Volunteers.vue'),
    meta: { requiresAuth: true }
  }
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('@/components/auth/Profile.vue'),
  //   meta: { requiresAuth: true }
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
    } else if (to.meta.requiredRole && authStore.user.role !== to.meta.requiredRole) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router