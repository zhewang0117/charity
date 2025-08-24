<template>
  <div class="medical-service">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title">
              <i class="fas fa-stethoscope"></i>
              Medical Service
            </h1>
            <p class="hero-subtitle">
              Comprehensive healthcare support for our community members
            </p>
            <button @click="goBack" class="btn btn-outline-light">
              <i class="fas fa-arrow-left"></i>
              Back
            </button>
          </div>
          <div class="col-lg-6">
            <div class="hero-image">
              <i class="fas fa-heartbeat"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div class="services-section">
      <div class="container">
        <h2 class="section-title">Our Medical Services</h2>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="service in services" :key="service.id">
            <div class="service-card">
              <div class="service-icon">
                <i :class="service.icon"></i>
              </div>
              <h4>{{ service.title }}</h4>
              <p>{{ service.description }}</p>
              <ul class="service-features">
                <li v-for="feature in service.features" :key="feature">
                  <i class="fas fa-check"></i>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="contact-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2>Need Medical Assistance?</h2>
            <p>Contact our medical team for professional healthcare support and guidance.</p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>(03) 1234 5679</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>medical@carenexus.org</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-clock"></i>
                <span>Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicalService',
  data() {
    return {
      services: [
        {
          id: 1,
          title: 'General Health Checkups',
          icon: 'fas fa-user-doctor',
          description: 'Comprehensive health assessments and preventive care.',
          features: [
            'Free health screenings',
            'Blood pressure monitoring',
            'Diabetes screening',
            'General health advice'
          ]
        },
        {
          id: 2,
          title: 'Mental Health Support',
          icon: 'fas fa-brain',
          description: 'Professional counseling and mental health services.',
          features: [
            'Individual counseling',
            'Group therapy sessions',
            'Crisis intervention',
            'Referral services'
          ]
        },
        {
          id: 3,
          title: 'Medication Assistance',
          icon: 'fas fa-pills',
          description: 'Help with accessing and managing medications.',
          features: [
            'Prescription assistance',
            'Medication reviews',
            'Pharmacy vouchers',
            'Drug interaction checks'
          ]
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.medical-service {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 5rem 0;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-title i {
  color: hsla(160, 100%, 37%, 1);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-image {
  text-align: center;
}

.hero-image i {
  font-size: 15rem;
  opacity: 0.3;
  color: hsla(160, 100%, 37%, 1);
}

.services-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #333;
}

.service-card {
  background: white;
  border-radius: 15px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  border: 3px solid transparent;
}

.service-card:hover {
  transform: translateY(-10px);
  border-color: #007bff;
  box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2);
}

.service-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.service-icon i {
  font-size: 2rem;
  color: white;
}

.service-card h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.service-card p {
  color: #666;
  margin-bottom: 2rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.service-features li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
}

.service-features i {
  color: hsla(160, 100%, 37%, 1);
  font-size: 0.9rem;
}

.contact-section {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 4rem 0;
}

.contact-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.contact-section p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.contact-item i {
  color: hsla(160, 100%, 37%, 1);
  font-size: 1.3rem;
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: white;
  color: #007bff;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-image i {
    font-size: 8rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .service-card {
    margin-bottom: 2rem;
  }
}
</style>