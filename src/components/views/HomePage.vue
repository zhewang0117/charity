<template>
  <div>
    <div class="hero-section bg-primary text-white py-5">
      <div class="container text-center">
        <h1 class="display-4">Welcome to Immigrant Health Support</h1>
        <p class="lead">Your trusted resource for healthcare information and support</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-light btn-lg mt-3">
          Join Our Community
        </router-link>
      </div>
    </div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-heart-pulse display-4 text-primary"></i>
              <h3 class="card-title mt-3">Healthcare Resources</h3>
              <p class="card-text">Find healthcare providers, insurance information, and health education materials.</p>
              <router-link to="/resources" class="btn btn-outline-primary">Explore Resources</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-people display-4 text-primary"></i>
              <h3 class="card-title mt-3">Community Support</h3>
              <p class="card-text">Connect with others, share experiences, and get support from our community.</p>
              <router-link to="/community" class="btn btn-outline-primary">Join Community</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-info-circle display-4 text-primary"></i>
              <h3 class="card-title mt-3">Information Hub</h3>
              <p class="card-text">Access reliable information about healthcare rights and services for immigrants.</p>
              <router-link to="/resources" class="btn btn-outline-primary">Learn More</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-light py-5 mt-5">
      <div class="container">
        <h2 class="text-center mb-4">Featured Resources</h2>
        <div class="row">
          <div v-for="resource in featuredResources" :key="resource.id" class="col-md-4 mb-4">
            <ResourceCard :resource="resource" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store'
import { useResourceStore } from '@/store'
import ResourceCard from '@/components/shared/ResourceCard.vue'

const authStore = useAuthStore()
const resourceStore = useResourceStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const featuredResources = computed(() => {
  return resourceStore.resources.slice(0, 3)
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://via.placeholder.com/1500x500');
  background-size: cover;
  background-position: center;
  border-radius: 0 0 50% 50% / 0 0 100px 100px;
}
</style>