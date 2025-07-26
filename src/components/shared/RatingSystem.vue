<template>
  <div class="rating-system">
    <div v-if="!disabled">
      <h5>Rate this Activity</h5>
      <div v-for="(rating, aspect) in ratings" :key="aspect" class="rating-aspect">
        <label>{{ aspect }}:</label>
        <div class="stars">
          <span v-for="star in 5" :key="star" @click="setRating(aspect, star)" :class="{ 'filled': star <= rating }">
            ★
          </span>
        </div>
      </div>
      <button @click="submitRatings" class="btn btn-sm btn-primary mt-2">Submit Ratings</button>
    </div>
    <div v-if="disabled">
      <p>You have already rated this activity.</p>
    </div>
    <div v-if="averageRating" class="average-rating mt-3">
        <h5>Overall Average Rating</h5>
        <ul>
            <li v-for="(avg, aspect) in averageRating.averages" :key="aspect">
                {{ aspect }}: {{ avg.toFixed(1) }} / 5
            </li>
        </ul>
        <p><strong>Overall Average:</strong> {{ averageRating.overallAverage.toFixed(1) }} / 5</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
  activityId: {
    type: [String, Number],
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Object,
    default: null
  }
});

const ratings = ref({
  helpfulness: 0,
  clarity: 0,
  friendliness: 0
});

const emit = defineEmits(['submit']);

const setRating = (aspect, value) => {
  ratings.value[aspect] = value;
};

const submitRatings = () => {
  emit('submit', { activityId: props.activityId, ratings: { ...ratings.value } });
  for (const aspect in ratings.value) {
    ratings.value[aspect] = 0;
  }
};
</script>

<style scoped>
.rating-system {
  border: 1px solid #ddd;
  padding: 15px;
  margin-top: 10px;
  border-radius: 5px;
}
.rating-aspect {
  margin-bottom: 10px;
}
.stars {
  cursor: pointer;
  color: #ffc107;
  font-size: 1.5rem;
}
.stars span {
  color: #ccc;
}
.stars span.filled {
  color: #ffc107;
}
</style>