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
        <li>
          <div class="nav-item" @click="toggleExportMenu">
            <span>Export Registrations</span>
            <i :class="['arrow', { 'down': isExportMenuOpen }]"></i>
          </div>
          <ul v-if="isExportMenuOpen" class="sub-nav">
            <li @click="exportToCSV">Export as CSV</li>
            <li @click="exportToPDF">Export as PDF</li>
          </ul>
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
          <button @click="openRegistrationModal(activity)" class="btn btn-primary">Join Activity</button>
        </div>
      </div>

      <!-- Registration Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeRegistrationModal">
        <div class="modal-content">
          <h2>Register for {{ selectedActivity.title }}</h2>
          <div class="activity-details">
            <p><strong>Location:</strong> {{ selectedActivity.location }}</p>
            <p><strong>Date:</strong> {{ selectedActivity.date }}</p>
            <p><strong>Contact Person:</strong> {{ selectedActivity.contactPerson }}</p>
          </div>
          <form @submit.prevent="submitRegistration">
            <div class="form-group">
              <label for="name">Full Name:</label>
              <input type="text" id="name" v-model="registrationForm.name" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="registrationForm.email" required>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" @click="closeRegistrationModal" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activityData from '@/assets/volunteer-activities.json';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import existingRegistrations from '@/assets/registrations.json';

export default {
  name: 'VolunteerHub',
  data() {
    return {
      isTaskCenterOpen: false,
      isExportMenuOpen: false,
      selectedLocation: '',
      selectedDate: '',
      locations: activityData.locations,
      activities: activityData.activities,
      isModalOpen: false,
      selectedActivity: null,
      registrationForm: {
        name: '',
        email: ''
      },
      newRegistrations: []
    }
  },
  computed: {
    filteredActivities() {
      return this.activities.filter(activity => {
        const locationMatch = !this.selectedLocation || activity.location === this.selectedLocation;
        const dateMatch = !this.selectedDate || activity.date === this.selectedDate;
        return locationMatch && dateMatch;
      });
    }
  },
  methods: {
    toggleTaskCenter() {
      this.isTaskCenterOpen = !this.isTaskCenterOpen;
    },
    toggleExportMenu() {
      this.isExportMenuOpen = !this.isExportMenuOpen;
    },
    selectSubTask(type) {
      console.log('Selected task type:', type);
    },
    selectSection(section) {
      console.log('Selected section:', section);
    },
    openRegistrationModal(activity) {
      this.selectedActivity = activity;
      this.isModalOpen = true;
    },
    closeRegistrationModal() {
      this.isModalOpen = false;
      this.selectedActivity = null;
      this.registrationForm.name = '';
      this.registrationForm.email = '';
    },
    submitRegistration() {
      const registration = {
        activityId: this.selectedActivity.id,
        activityTitle: this.selectedActivity.title,
        userName: this.registrationForm.name,
        userEmail: this.registrationForm.email,
        registrationDate: new Date().toISOString(),
        location: this.selectedActivity.location,
        date: this.selectedActivity.date,
        contactPerson: this.selectedActivity.contactPerson
      };
      this.newRegistrations.push(registration);
      alert(`Successfully registered for ${this.selectedActivity.title}!`);
      this.closeRegistrationModal();
    },
    exportToCSV() {
      const allRegistrations = [...existingRegistrations, ...this.newRegistrations];
      if (allRegistrations.length === 0) {
        alert('No registrations to export.');
        return;
      }
      const csv = Papa.unparse(allRegistrations);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'registrations.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF() {
      const allRegistrations = [...existingRegistrations, ...this.newRegistrations];
      if (allRegistrations.length === 0) {
        alert('No registrations to export.');
        return;
      }

      const doc = new jsPDF();
      doc.text('Volunteer Registrations', 14, 16);

      const tableColumn = [
        'Activity Title', 'User Name', 'User Email', 'Registration Date',
        'Location', 'Date', 'Contact Person'
      ];
      const tableRows = [];

      allRegistrations.forEach(reg => {
        const registrationData = [
          reg.activityTitle || '',
          reg.userName || '',
          reg.userEmail || '',
          reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '',
          reg.location || '',
          reg.date || '',
          reg.contactPerson || ''
        ];
        tableRows.push(registrationData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20
      });

      doc.save('registrations.pdf');
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #5a6268;
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
