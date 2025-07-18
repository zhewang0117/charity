<template>
  <div>
    <h2 class="mb-4">Health Resources</h2>
    
    <div v-if="userRole === 'admin'" class="card mb-4">
      <div class="card-body">
        <h5>Add New Resource</h5>
        <form @submit.prevent="addResource">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" v-model="newResource.title" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="newResource.description" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-select" v-model="newResource.category">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Add Resource</button>
        </form>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="row">
        <div class="col-md-8">
          <input type="text" class="form-control" placeholder="Search resources..." v-model="searchQuery">
        </div>
        <div class="col-md-4">
          <select class="form-select" v-model="selectedCategory">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div v-for="resource in filteredResources" :key="resource.id" class="col-md-4 mb-4">
        <ResourceCard :resource="resource" />
      </div>
    </div>
    
    <div v-if="filteredResources.length === 0" class="alert alert-info">
      No resources found matching your criteria
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store'
import { useResourceStore } from '@/store'
import ResourceCard from '@/components/shared/ResourceCard.vue'

const authStore = useAuthStore()
const resourceStore = useResourceStore()

const userRole = computed(() => authStore.user?.role || '')
const categories = ['healthcare', 'legal', 'education', 'housing', 'employment', 'mental health']

const newResource = ref({
  title: '',
  description: '',
  category: 'healthcare'
})

const searchQuery = ref('')
const selectedCategory = ref('')

const addResource = () => {
  resourceStore.addResource({
    title: newResource.value.title,
    description: newResource.value.description,
    category: newResource.value.category
  })
  newResource.value = { title: '', description: '', category: 'healthcare' }
}

const filteredResources = computed(() => {
  return resourceStore.resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || resource.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>