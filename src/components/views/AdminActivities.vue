<template>
  <div class="admin-activities-page">
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white py-4">
      <div class="container">
        <h1 class="display-5">
          <i class="bi bi-gear-fill me-3"></i>
          Manage Volunteer Activities
        </h1>
        <p class="lead mb-0">Administrative panel for volunteer activity management</p>
      </div>
    </div>

    <div class="container mt-4">
      <div class="alert alert-info border-0 shadow-sm" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-info-circle-fill me-3 text-primary fs-4"></i>
          <div>
            <strong>Admin Note:</strong> To add, edit, or remove activities, please modify the 
            <code class="bg-light px-2 py-1 rounded">src/assets/volunteer-activities.json</code> file directly.
          </div>
        </div>
      </div>

      <!-- Activities List -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">
            <i class="bi bi-list-ul me-2"></i>
            Existing Activities
          </h4>
        </div>
        <div class="card-body p-0">
          <div class="activity-item" v-for="activity in activities" :key="activity.id">
            <div class="p-4 border-bottom">
              <div class="row align-items-center">
                <div class="col-md-7">
                  <h5 class="text-primary mb-2">
                    <i class="bi bi-star-fill me-2 text-warning"></i>
                    {{ activity.name }}
                  </h5>
                  <p class="text-muted mb-3">{{ activity.description }}</p>
                </div>
                
                <div class="col-md-5">
                  <div class="d-flex align-items-center gap-2">
                    <select 
                      v-model="selectedVolunteer[activity.id]" 
                      class="form-select flex-grow-1"
                    >
                      <option disabled value="">Select Volunteer</option>
                      <option v-for="volunteer in volunteers" :key="volunteer.id" :value="volunteer.id">
                        {{ volunteer.name }}
                      </option>
                    </select>
                    <button 
                      @click="assignAndComplete(activity.id)" 
                      class="btn btn-success"
                      :disabled="!selectedVolunteer[activity.id]"
                    >
                      <i class="bi bi-check-circle me-1"></i>
                      Assign & Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-activity text-primary display-4"></i>
              <h5 class="mt-3">Total Activities</h5>
              <h3 class="text-primary">{{ activities.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-people-fill text-success display-4"></i>
              <h5 class="mt-3">Available Volunteers</h5>
              <h3 class="text-success">{{ volunteers.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-clipboard-check text-warning display-4"></i>
              <h5 class="mt-3">Assignments Made</h5>
              <h3 class="text-warning">{{ assignmentCount }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store';

const store = useAuthStore();

const selectedVolunteer = ref({});
const assignmentCount = ref(0);

const activities = computed(() => store.volunteerActivities);
const volunteers = computed(() => store.volunteers);

const assignAndComplete = (activityId) => {
  const volunteerId = selectedVolunteer.value[activityId];
  if (volunteerId) {
    store.completeService(volunteerId, activityId);
    assignmentCount.value++;
    alert(`Service record created for volunteer and activity.`);
    selectedVolunteer.value[activityId] = ''; // Reset dropdown
  }
};
</script>

<style scoped>
.admin-activities-page {
  min-height: 100vh;
  background-color: var(--color-background-soft, #f8f8f8);
}

.hero-section {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.activity-item:last-child .border-bottom {
  border-bottom: none !important;
}

.activity-item:hover {
  background-color: #f8f9fa;
}

.btn-success {
  background: linear-gradient(135deg, hsla(160, 100%, 37%, 1) 0%, hsla(160, 100%, 30%, 1) 100%);
  border: none;
}

.btn-success:hover {
  background: linear-gradient(135deg, hsla(160, 100%, 30%, 1) 0%, hsla(160, 100%, 25%, 1) 100%);
}

.text-success {
  color: hsla(160, 100%, 37%, 1) !important;
}
</style>
}
</style>