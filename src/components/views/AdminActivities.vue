<template>
  <div class="container mt-5">
    <h3>Manage Volunteer Activities</h3>

    <div class="alert alert-info" role="alert">
      <strong>Admin Note:</strong> To add, edit, or remove activities, please modify the <code>src/assets/volunteer-activities.json</code> file directly.
    </div>

    <!-- Activities List -->
    <div class="card">
      <div class="card-header">Existing Activities</div>
      <div class="card-body">
        <ul class="list-group">
          <li v-for="activity in activities" :key="activity.id" class="list-group-item">
            <h5>{{ activity.name }}</h5>
            <p>{{ activity.description }}</p>
            
            <!-- Assign Volunteer -->
            <div class="d-flex align-items-center mt-2">
              <select v-model="selectedVolunteer[activity.id]" class="form-select me-2" style="width: 200px;">
                <option disabled value="">Select Volunteer</option>
                <option v-for="volunteer in volunteers" :key="volunteer.id" :value="volunteer.id">
                  {{ volunteer.name }}
                </option>
              </select>
              <button @click="assignAndComplete(activity.id)" class="btn btn-success" :disabled="!selectedVolunteer[activity.id]">
                Assign & Mark Complete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store';

const store = useAuthStore();

const selectedVolunteer = ref({});

const activities = computed(() => store.volunteerActivities);
const volunteers = computed(() => store.volunteers);

const assignAndComplete = (activityId) => {
  const volunteerId = selectedVolunteer.value[activityId];
  if (volunteerId) {
    store.completeService(volunteerId, activityId);
    alert(`Service record created for volunteer and activity.`);
    selectedVolunteer.value[activityId] = ''; // Reset dropdown
  }
};

</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>