<template>
  <div class="activities-page">
    <h1>Activities</h1>
    <p>Join our community activities and events.</p>

    <div class="activities-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-card" @click="goToActivity(activity.id)">
        <h3>{{ activity.name }}</h3>
        <p>{{ activity.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data - replace with API call
const activities = ref([
  { id: 1, name: 'English Class', description: 'Learn English with our community.' },
  { id: 2, name: 'Job Fair', description: 'Find your next job opportunity.' },
  { id: 3, name: 'Cultural Night', description: 'Share and celebrate your culture.' },
]);

const goToActivity = (id) => {
  router.push({ name: 'ActivityDetails', params: { id } });
};
</script>

<style scoped>
.activities-page {
  padding: 20px;
}
.activities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.activity-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.activity-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>