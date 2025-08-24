<template>
  <div class="appointment-booking">
    <div class="container">

      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-calendar-check"></i>
          Book Appointment
        </h1>
        <p class="page-subtitle">Schedule your healthcare or support services</p>
      </div>


      <div class="service-selection">
        <h3>Select Service</h3>
        <div class="service-grid">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="service-card"
            :class="{ active: selectedService?.id === service.id }"
            @click="selectService(service)"
          >
            <i :class="service.icon"></i>
            <h4>{{ service.name }}</h4>
            <p>{{ service.description }}</p>
            <span class="duration">{{ service.duration }} min</span>
          </div>
        </div>
      </div>

      <div v-if="selectedService" class="booking-form">
        <div class="form-container">
          <div class="calendar-section">
            <h3>Select Date & Time</h3>
   
            <div class="calendar-container">
              <div class="calendar-header">
                <button @click="previousMonth" class="nav-btn">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <h4>{{ currentMonthYear }}</h4>
                <button @click="nextMonth" class="nav-btn">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div class="calendar-grid">
                <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                <div 
                  v-for="date in calendarDates" 
                  :key="date.key"
                  class="calendar-date"
                  :class="{ 
                    'other-month': !date.isCurrentMonth,
                    'selected': isSelectedDate(date),
                    'disabled': !isDateAvailable(date),
                    'today': isToday(date)
                  }"
                  @click="selectDate(date)"
                >
                  {{ date.day }}
                </div>
              </div>
            </div>

            <!-- 时间选择 -->
            <div v-if="selectedDate" class="time-selection">
              <h4>Available Times</h4>
              <div class="time-slots">
                <button
                  v-for="time in availableTimes"
                  :key="time"
                  class="time-slot"
                  :class="{ active: selectedTime === time }"
                  @click="selectTime(time)"
                  :disabled="!isTimeAvailable(time)"
                >
                  {{ time }}
                </button>
              </div>
            </div>
          </div>

          <!-- 预约信息表单 -->
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            
            <form @submit.prevent="submitAppointment">
              <div class="form-group">
                <label for="patientName">Full Name *</label>
                <input 
                  type="text" 
                  id="patientName" 
                  v-model="appointmentForm.patientName" 
                  required
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="appointmentForm.email" 
                  required
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="appointmentForm.phone" 
                  required
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label for="reason">Reason for Visit</label>
                <textarea 
                  id="reason" 
                  v-model="appointmentForm.reason" 
                  rows="3"
                  class="form-control"
                  placeholder="Please describe your needs..."
                ></textarea>
              </div>

              <div class="form-group">
                <label for="urgency">Urgency Level</label>
                <select 
                  id="urgency" 
                  v-model="appointmentForm.urgency"
                  class="form-control"
                >
                  <option value="low">Low - Routine visit</option>
                  <option value="medium">Medium - Preferred this week</option>
                  <option value="high">High - Urgent, ASAP</option>
                </select>
              </div>

              <!-- 预约摘要 -->
              <div v-if="selectedService && selectedDate && selectedTime" class="appointment-summary">
                <h4>Appointment Summary</h4>
                <div class="summary-item">
                  <i class="fas fa-user-md"></i>
                  <span>{{ selectedService.name }}</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatSelectedDate() }}</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ selectedTime }} ({{ selectedService.duration }} min)</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ selectedService.location }}</span>
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="!canSubmit || isSubmitting"
                >
                  <i class="fas fa-check" v-if="!isSubmitting"></i>
                  <i class="fas fa-spinner fa-spin" v-else></i>
                  {{ isSubmitting ? 'Booking...' : 'Book Appointment' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  @click="resetForm"
                >
                  <i class="fas fa-redo"></i>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 成功消息 -->
      <div v-if="showSuccess" class="success-modal">
        <div class="modal-content">
          <i class="fas fa-check-circle success-icon"></i>
          <h3>Appointment Booked Successfully!</h3>
          <p>Your appointment has been scheduled. You will receive a confirmation email shortly.</p>
          <div class="appointment-details-summary">
            <p><strong>Service:</strong> {{ bookedAppointment.service }}</p>
            <p><strong>Date:</strong> {{ bookedAppointment.date }}</p>
            <p><strong>Time:</strong> {{ bookedAppointment.time }}</p>
            <p><strong>Reference:</strong> {{ bookedAppointment.reference }}</p>
          </div>
          <button @click="closeSuccessModal" class="btn btn-primary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export default {
  name: 'AppointmentBooking',
  setup() {
    // 响应式数据
    const selectedService = ref(null);
    const selectedDate = ref(null);
    const selectedTime = ref(null);
    const currentDate = ref(new Date());
    const isSubmitting = ref(false);
    const showSuccess = ref(false);
    const bookedAppointment = ref({});

    // 表单数据
    const appointmentForm = ref({
      patientName: '',
      email: '',
      phone: '',
      reason: '',
      urgency: 'low'
    });

    // 服务类型
    const services = ref([
      {
        id: 1,
        name: 'General Consultation',
        description: 'Initial health assessment and general medical consultation',
        duration: 30,
        icon: 'fas fa-stethoscope',
        location: 'Main Clinic - Room 101',
        available: true
      },
      {
        id: 2,
        name: 'Mental Health Support',
        description: 'Counseling and mental health assessment',
        duration: 60,
        icon: 'fas fa-brain',
        location: 'Counseling Center - Room 205',
        available: true
      },
      {
        id: 3,
        name: 'Legal Consultation',
        description: 'Immigration and legal advice services',
        duration: 45,
        icon: 'fas fa-balance-scale',
        location: 'Legal Aid Office - Room 301',
        available: true
      },
      {
        id: 4,
        name: 'Language Support',
        description: 'Translation and interpretation services',
        duration: 30,
        icon: 'fas fa-language',
        location: 'Language Center - Room 150',
        available: true
      },
      {
        id: 5,
        name: 'Social Services',
        description: 'Housing, employment, and social support',
        duration: 45,
        icon: 'fas fa-hands-helping',
        location: 'Social Services - Room 201',
        available: true
      }
    ]);

    // 工作时间配置
    const workingHours = {
      start: 9, // 9 AM
      end: 17, // 5 PM
      interval: 30, // 30分钟间隔
      unavailableDays: [0, 6], // 周日和周六不可用
      holidays: ['2024-12-25', '2024-01-01'], // 节假日
      blockedTimes: {
        // 每天的午休时间
        '12:00': true,
        '12:30': true,
        '13:00': true
      }
    };

    // 计算属性
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    });

    const calendarDates = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      
      // 获取当月第一天
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // 获取日历开始日期（包含上月末尾几天）
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      // 获取日历结束日期（包含下月开始几天）
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
      
      const dates = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        dates.push({
          date: new Date(current),
          day: current.getDate(),
          isCurrentMonth: current.getMonth() === month,
          key: current.toISOString().split('T')[0]
        });
        current.setDate(current.getDate() + 1);
      }
      
      return dates;
    });

    const availableTimes = computed(() => {
      if (!selectedDate.value) return [];
      
      const times = [];
      const start = workingHours.start;
      const end = workingHours.end;
      const interval = workingHours.interval;
      
      for (let hour = start; hour < end; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          if (!workingHours.blockedTimes[timeStr]) {
            times.push(timeStr);
          }
        }
      }
      
      return times;
    });

    const canSubmit = computed(() => {
      return selectedService.value && 
             selectedDate.value && 
             selectedTime.value && 
             appointmentForm.value.patientName && 
             appointmentForm.value.email && 
             appointmentForm.value.phone;
    });

    // 方法
    const selectService = (service) => {
      selectedService.value = service;
      // 重置日期和时间选择
      selectedDate.value = null;
      selectedTime.value = null;
    };

    const previousMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      );
    };

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      );
    };

    const isSelectedDate = (date) => {
      return selectedDate.value && 
             date.date.toDateString() === selectedDate.value.toDateString();
    };

    const isToday = (date) => {
      const today = new Date();
      return date.date.toDateString() === today.toDateString();
    };

    const isDateAvailable = (date) => {
      if (!date.isCurrentMonth) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      

      if (date.date < today) return false;
      
   
      const dayOfWeek = date.date.getDay();
      if (workingHours.unavailableDays.includes(dayOfWeek)) return false;
     
      const dateStr = date.date.toISOString().split('T')[0];
      if (workingHours.holidays.includes(dateStr)) return false;
      
      return true;
    };

    const selectDate = (date) => {
      if (isDateAvailable(date)) {
        selectedDate.value = date.date;
        selectedTime.value = null; 
      }
    };

    const selectTime = (time) => {
      selectedTime.value = time;
    };

    const isTimeAvailable = () => {
      
      return true;
    };

    const formatSelectedDate = () => {
      return selectedDate.value?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const generateReference = () => {
      return 'APT-' + Date.now().toString(36).toUpperCase() + 
             Math.random().toString(36).substr(2, 5).toUpperCase();
    };

    const submitAppointment = async () => {
      if (!canSubmit.value) return;
      
      isSubmitting.value = true;
      
      try {
    
        const appointmentData = {
          serviceId: selectedService.value.id,
          serviceName: selectedService.value.name,
          date: selectedDate.value.toISOString().split('T')[0],
          time: selectedTime.value,
          duration: selectedService.value.duration,
          location: selectedService.value.location,
          patientName: appointmentForm.value.patientName,
          email: appointmentForm.value.email,
          phone: appointmentForm.value.phone,
          reason: appointmentForm.value.reason,
          urgency: appointmentForm.value.urgency,
          reference: generateReference(),
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        const bookAppointment = httpsCallable(functions, 'bookAppointment');
        const result = await bookAppointment(appointmentData);

        if (result.data.success) {

          bookedAppointment.value = {
            service: selectedService.value.name,
            date: formatSelectedDate(),
            time: selectedTime.value,
            reference: appointmentData.reference
          };
          
          showSuccess.value = true;
          resetForm();
        } else {
          alert('Booking failed: ' + result.data.message);
        }
      } catch (error) {
        console.error('Appointment booking error:', error);
        alert('Failed to book appointment. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => {
      selectedService.value = null;
      selectedDate.value = null;
      selectedTime.value = null;
      appointmentForm.value = {
        patientName: '',
        email: '',
        phone: '',
        reason: '',
        urgency: 'low'
      };
    };

    const closeSuccessModal = () => {
      showSuccess.value = false;
      bookedAppointment.value = {};
    };

    return {
     
      selectedService,
      selectedDate,
      selectedTime,
      currentDate,
      isSubmitting,
      showSuccess,
      bookedAppointment,
      appointmentForm,
      services,
      
      
      weekdays,
      currentMonthYear,
      calendarDates,
      availableTimes,
      canSubmit,
      
      selectService,
      previousMonth,
      nextMonth,
      isSelectedDate,
      isToday,
      isDateAvailable,
      selectDate,
      selectTime,
      isTimeAvailable,
      formatSelectedDate,
      submitAppointment,
      resetForm,
      closeSuccessModal
    };
  }
};
</script>

<style scoped>
.appointment-booking {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-title i {
  margin-right: 1rem;
  color: #ffd700;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 服务选择 */
.service-selection {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.service-selection h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card {
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.service-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
}

.service-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.service-card i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #667eea;
}

.service-card.active i {
  color: #ffd700;
}

.service-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.service-card p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.duration {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.service-card.active .duration {
  background: rgba(255, 255, 255, 0.2);
}

/* 预约表单 */
.booking-form {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* 日历部分 */
.calendar-section h3,
.appointment-details h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.calendar-container {
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.calendar-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekday {
  background: #f8f9fa;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
}

.calendar-date {
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.calendar-date:hover:not(.disabled) {
  background: #f0f8ff;
}

.calendar-date.other-month {
  color: #ccc;
  cursor: not-allowed;
}

.calendar-date.disabled {
  color: #ccc;
  cursor: not-allowed;
  background: #f8f8f8;
}

.calendar-date.selected {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.calendar-date.today {
  background: #ffd700;
  font-weight: 600;
}

/* 时间选择 */
.time-selection h4 {
  margin-bottom: 1rem;
  color: #333;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.time-slot {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.time-slot:hover:not(:disabled) {
  border-color: #667eea;
  background: #f0f8ff;
}

.time-slot.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.time-slot:disabled {
  background: #f8f8f8;
  color: #ccc;
  cursor: not-allowed;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 预约摘要 */
.appointment-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  border-left: 4px solid #667eea;
}

.appointment-summary h4 {
  margin-bottom: 1rem;
  color: #333;
}

.summary-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-item i {
  width: 20px;
  margin-right: 1rem;
  color: #667eea;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* 成功模态框 */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.success-modal .modal-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.success-icon {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.success-modal h3 {
  color: #333;
  margin-bottom: 1rem;
}

.appointment-details-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  text-align: left;
}

.appointment-details-summary p {
  margin-bottom: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .service-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .time-slots {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
