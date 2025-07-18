<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ resource.title }}</h5>
      <p class="card-text">{{ resource.description }}</p>
      <p class="text-muted">
        <small>
          Category: {{ resource.category }} | 
          Added: {{ formatDate(resource.createdAt) }}
        </small>
      </p>
    </div>
    <div class="card-footer">
      <RatingSystem :resource-id="resource.id" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>