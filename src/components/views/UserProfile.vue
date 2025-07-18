<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center">
      <h2>User Dashboard</h2>
      <router-link to="/profile/edit" class="btn btn-primary">Edit Profile</router-link>
    </div>
    <div v-if="user" class="mt-4">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>

    <div class="pending-ratings mt-5">
      <h3>Pending Service Ratings</h3>
      <div v-if="pendingRatings.length === 0">
        <p>You have no pending services to rate.</p>
      </div>
      <div v-else>
        <div v-for="record in pendingRatings" :key="record.id" class="rating-card">
          <h4>{{ record.activityTitle }}</h4>
          <p><strong>Volunteer:</strong> {{ getVolunteerName(record.volunteerId) }}</p>
          <div class="rating-inputs">
            <div class="rating-dimension">
              <label>Professionalism:</label>
              <select v-model.number="ratings[record.id].professionalism">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="rating-dimension">
              <label>Friendliness:</label>
              <select v-model.number="ratings[record.id].friendliness">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="rating-dimension">
              <label>Helpfulness:</label>
              <select v-model.number="ratings[record.id].helpfulness">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>
          <button @click="handleRatingSubmit(record.id)" class="btn btn-info">Submit Rating</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { useAuthStore } from '@/store';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'UserProfile',
  data() {
    return {
      ratings: {}
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user']),
    pendingRatings() {
      const authStore = useAuthStore();
      return authStore.getPendingRatings();
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['submitRating', 'getVolunteerById']),
    getVolunteerName(volunteerId) {
      const volunteer = this.getVolunteerById(volunteerId);
      return volunteer ? volunteer.name : 'Unknown';
    },
    handleRatingSubmit(recordId) {
      this.submitRating(recordId, this.ratings[recordId]);
      alert('Thank you for your feedback!');
    },
    initializeRatings() {
      this.pendingRatings.forEach(record => {
        if (!this.ratings[record.id]) {
          this.ratings[record.id] = {
            professionalism: 5,
            friendliness: 5,
            helpfulness: 5
          };
        }
      });
    }
  },
  watch: {
    pendingRatings: {
      handler: 'initializeRatings',
      immediate: true
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.pending-ratings {
  margin-top: 30px;
}
.rating-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}
.rating-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}
.rating-dimension {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-info {
    color: #fff;
    background-color: #0dcaf0;
    border-color: #0dcaf0;
}
</style>