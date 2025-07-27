<template>
  <div class="volunteer-hub">
    <!-- Left Navigation -->
    <div class="side-nav">
      <ul class="nav-list">
        <li>
          <div class="nav-item" @click="toggleTaskCenter">
            <span>Task Center</span>
            <i :class="['arrow', { 'down': isTaskCenterOpen }]"></i>
          </div>
          <ul v-if="isTaskCenterOpen" class="sub-nav">
            <li @click="selectSubTask('ongoing')">Ongoing Tasks</li>
            <li @click="selectSubTask('completed')">Completed Tasks</li>
            <li @click="selectSubTask('available')">Available Tasks</li>
          </ul>
        </li>
        <li>
          <div class="nav-item" @click="selectSection('resources')">
            Resources Verification
          </div>
        </li>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <div class="filters">
        <div class="filter-group">
          <label>Location:</label>
          <select v-model="selectedLocation">
            <option value="">All Locations</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Date:</label>
          <input type="date" v-model="selectedDate">
        </div>
      </div>

      <!-- Activity List -->
      <div class="activities-list">
        <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card">
          <h3>{{ activity.title }}</h3>
          <p class="location">📍 {{ activity.location }}</p>
          <p class="date">📅 {{ activity.date }}</p>
          <p class="description">{{ activity.description }}</p>
          <button class="btn btn-primary">Join Activity</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activityData from '@/assets/volunteer-activities.json';

export default {
  name: 'VolunteerHub',
  data() {
    return {
      isTaskCenterOpen: false,
      selectedLocation: '',
      selectedDate: '',
      locations: activityData.locations,
      activities: activityData.activities
    }
  },
  computed: {
    filteredActivities() {
      return this.activities.filter(activity => {
        const locationMatch = !this.selectedLocation || activity.location === this.selectedLocation
        const dateMatch = !this.selectedDate || activity.date === this.selectedDate
        return locationMatch && dateMatch
      })
    }
  },
  methods: {
    toggleTaskCenter() {
      this.isTaskCenterOpen = !this.isTaskCenterOpen
    },
    selectSubTask(type) {
      console.log('Selected task type:', type)
      // Load data based on the selected task type
    },
    selectSection(section) {
      console.log('Selected section:', section)
      // Handle logic for the resource validation section
    }
  }
}
</script>

<style scoped>
.volunteer-hub {
  display: flex;
  height: calc(100vh - 80px); /* Adjust based on your navbar height */
}

.side-nav {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.arrow {
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  transition: transform 0.3s;
}

.arrow.down {
  transform: rotate(-135deg);
}

.sub-nav {
  list-style: none;
  padding-left: 20px;
  margin-top: 10px;
}

.sub-nav li {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sub-nav li:hover {
  background-color: #dcdcdc;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.activities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.activity-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-card h3 {
  margin-top: 0;
}

.activity-card .location,
.activity-card .date {
  color: #555;
  margin: 5px 0;
}

.activity-card .description {
  margin-top: 15px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>

<style scoped>
@media (max-width: 991px) {
  .volunteer-hub {
    flex-direction: column;
    height: auto;
  }
  .side-nav {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    background: #f4f4f4;
  }
  .nav-list {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;
  }
  .nav-item {
    padding: 10px 12px;
    font-size: 1rem;
    border-radius: 5px 5px 0 0;
    white-space: nowrap;
  }
  .sub-nav {
    position: absolute;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    left: 0;
    right: 0;
    top: 100%;
    z-index: 10;
    padding-left: 0;
    margin-top: 0;
  }
  .main-content {
    padding: 10px;
  }
  .filters {
    flex-direction: column;
    gap: 10px;
  }
  .activities-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .activity-card {
    padding: 12px;
    font-size: 0.97rem;
  }
}

@media (max-width: 575px) {
  .side-nav {
    flex-direction: column;
    padding: 0 0 10px 0;
  }
  .nav-list {
    flex-direction: column;
    gap: 0;
  }
  .nav-item {
    border-radius: 0;
    border-bottom: 1px solid #eee;
    padding: 10px 8px;
    font-size: 0.98rem;
  }
  .main-content {
    padding: 6px;
  }
  .activity-card {
    padding: 8px;
    font-size: 0.95rem;
  }
}
</style>
