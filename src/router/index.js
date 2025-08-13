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
    path: '/staff',
    name: 'staff',
    component: () => import('@/components/views/Staff.vue'),
    meta: { requiresAuth: true } // 根据需要添加
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
    path: '/support-us',
    name: 'support-us',
    component: () => import('@/components/views/SupportUs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/activities',
    name: 'admin-activities',
    component: () => import('@/components/views/AdminActivities.vue'),
    meta: { requiresAuth: true, requiredRole: 'admin' }
  },
  {
    path: '/activity/:id',
    name: 'ActivityDetails',
    component: () => import('@/components/views/ActivityDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/email',
    name: 'email',
    component: () => import('@/components/email/EmailSender.vue'),
    meta: { requiresAuth: true }
  },
  {
      path: '/map',
      name: 'map',
      component: () => import('../components/views/MapView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/staff',
      name: 'staff',
      component: () => import('../components/views/StaffList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activities',
      name: 'Activities',
      component: () => import('../components/views/ActivitiesList.vue'),
      meta: { requiresAuth: true },
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log(`Navigating from ${from.path} to ${to.path}`);
  console.log(`authStore.isAuthenticated: ${authStore.isAuthenticated}`);
  console.log(`authStore.user:`, authStore.user);
  console.log(`Route meta:`, to.meta);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('Route requires authentication.');
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated. Redirecting to login.');
      next({ name: 'login' })
    } else if (to.meta.requiredRole && authStore.user.role !== to.meta.requiredRole) {
      console.log(`User role ${authStore.user.role} does not match required role ${to.meta.requiredRole}. Redirecting to home.`);
      next({ name: 'home' })
    } else {
      console.log('User authenticated and has required role (or no role required). Proceeding.');
      next()
    }
  } else {
    console.log('Route does not require authentication. Proceeding.');
    next()
  }
})

export default router