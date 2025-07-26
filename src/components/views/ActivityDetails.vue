<template>
  <div class="activity-details-page">
    <div v-if="loading">Loading activity...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="activity">
      <h1>{{ activity.name }}</h1>
      <p>{{ activity.description }}</p>

      <hr>

      <!-- Rating System -->
      <RatingSystem 
        :activity-id="activity.id" 
        :disabled="userHasRated" 
        :average-rating="activity.ratings"
        @submit="handleRatingSubmit" 
      />

      <hr>

      <h3>Comments</h3>
      <div v-if="activity.comments && activity.comments.length">
        <div v-for="comment in activity.comments" :key="comment.id" class="comment-card">
          <p><strong>{{ comment.author }}</strong>: {{ comment.text }}</p>
        </div>
      </div>
      <div v-else>
        <p>No comments yet.</p>
      </div>
      
      <!-- Add Comment Form -->
      <div class="add-comment-form">
        <h4>Leave a Comment</h4>
        <textarea v-model="newComment" placeholder="Write your comment here..."></textarea>
        <button @click="submitComment">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import RatingSystem from '@/components/shared/RatingSystem.vue';

const route = useRoute();
const activity = ref(null);
const loading = ref(true);
const error = ref(null);
const newComment = ref('');
const userHasRated = ref(false); // In a real app, this would come from user state

const fetchActivityDetails = () => {
  const activityId = route.params.id;
  const mockActivities = [
      { id: 1, name: 'English Class', description: 'Learn English with our community.', comments: [{id: 1, author: 'John Doe', text: 'Great class!'}], ratingsData: [] },
      { id: 2, name: 'Job Fair', description: 'Find your next job opportunity.', comments: [], ratingsData: [] },
      { id: 3, name: 'Cultural Night', description: 'Share and celebrate your culture.', comments: [], ratingsData: [] },
    ];
  
  activity.value = mockActivities.find(a => a.id.toString() === activityId);
  // Simulate checking if user has rated
  // In a real app, you'd check against a user's rating history for this activityId
  userHasRated.value = (localStorage.getItem(`rated_activity_${activityId}`) === 'true');
  calculateAverageRating();
  loading.value = false;
};

const submitComment = () => {
  if (newComment.value.trim()) {
    const comment = {
      id: Date.now(),
      author: 'Current User', // Replace with actual user data
      text: newComment.value
    };
    activity.value.comments.push(comment);
    newComment.value = '';
  }
};

const handleRatingSubmit = ({ activityId, ratings }) => {
  if (userHasRated.value) return;

  console.log('Rating submitted for activity:', activityId, ratings);
  if (activity.value) {
    if (!activity.value.ratingsData) {
      activity.value.ratingsData = [];
    }
    activity.value.ratingsData.push(ratings);
    userHasRated.value = true;
    localStorage.setItem(`rated_activity_${activityId}`, 'true'); // Persist rated status
    calculateAverageRating();
  }
};

const calculateAverageRating = () => {
  if (activity.value && activity.value.ratingsData && activity.value.ratingsData.length > 0) {
    const numRatings = activity.value.ratingsData.length;
    const totals = activity.value.ratingsData.reduce((acc, r) => {
      for (const aspect in r) {
        acc[aspect] = (acc[aspect] || 0) + r[aspect];
      }
      return acc;
    }, {});

    const averages = {};
    let overallTotal = 0;
    let aspectCount = 0;
    for (const aspect in totals) {
      averages[aspect] = totals[aspect] / numRatings;
      overallTotal += averages[aspect];
      aspectCount++;
    }

    activity.value.ratings = {
      averages,
      overallAverage: aspectCount > 0 ? overallTotal / aspectCount : 0
    };
  } else {
    activity.value.ratings = null;
  }
};

onMounted(() => {
  fetchActivityDetails();
});
</script>

<style scoped>
.activity-details-page {
  padding: 20px;
}
.comment-card {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.add-comment-form {
  margin-top: 20px;
}
.add-comment-form textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 10px;
}
</style>