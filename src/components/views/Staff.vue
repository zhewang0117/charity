<template>
  <div class="volunteers-container">
    <h2>Our Volunteers</h2>
    <div class="volunteer-list">
      <div v-for="volunteer in volunteers" :key="volunteer.id" class="volunteer-card">
        <h3>{{ volunteer.name }}</h3>
        <p><strong>Average Rating:</strong> {{ getVolunteerAverageRating(volunteer.id) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'VolunteersList',
  computed: {
    ...mapState(useAuthStore, ['volunteers'])
  },
  methods: {
    ...mapActions(useAuthStore, ['getVolunteerAverageRating'])
  }
};
</script>

<style scoped>
.volunteers-container {
  padding: 20px;
}
.volunteer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.volunteer-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
</style>






