<template>
<div class="emergency-container">
    <button class="back-btn">
      <i class="fas fa-arrow-left"></i> Back
    </button>
    
    <h1 class="page-title">Emergency Help</h1>
    
    <div class="row g-4">
      <!-- Food Service Card -->
      <div class="col-md-4">
        <a href="/food-service" class="card-link">
          <div class="service-card">
            <div class="card-img-container">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="card-img" alt="Food Service">
              <div class="card-overlay">
                <div class="card-overlay-icon">
                  <i class="fas fa-utensils"></i>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-utensils"></i> Food</h5>
              <p class="card-text">Find local food banks, free meals, and emergency food assistance programs near you.</p>
            </div>
          </div>
        </a>
      </div>
      
      <!-- Housing Service Card -->
      <div class="col-md-4">
        <a href="/housing-service" class="card-link">
          <div class="service-card">
            <div class="card-img-container">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="card-img" alt="Housing Service">
              <div class="card-overlay">
                <div class="card-overlay-icon">
                  <i class="fas fa-home"></i>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-home"></i> Housing</h5>
              <p class="card-text">Get immediate shelter assistance, emergency housing, and support to prevent homelessness.</p>
            </div>
          </div>
        </a>
      </div>
      
      <!-- Medical Service Card -->
      <div class="col-md-4">
        <a href="/medical-service" class="card-link">
          <div class="service-card">
            <div class="card-img-container">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="card-img" alt="Medical Service">
              <div class="card-overlay">
                <div class="card-overlay-icon">
                  <i class="fas fa-heartbeat"></i>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-heartbeat"></i> Medical Service</h5>
              <p class="card-text">Access urgent medical care, mental health support, and emergency health services.</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    
    <div class="urgent-section">
      <div class="urgent-header">
        <div class="urgent-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Urgent Assistance Needed?</h3>
      </div>
      <div class="urgent-content">
        <p>If you or someone you know is in immediate danger or crisis, please contact emergency services immediately.</p>
        <p>We also provide 24/7 crisis support for migrants in urgent situations.</p>
      </div>
      <button class="urgent-btn">
        <i class="fas fa-phone-alt"></i> Call Now: 1800 123 456
      </button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'EmergencyHelp',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
:root {
      --primary: #3498db;
      --secondary: #2c3e50;
      --accent: #27ae60;
      --light: #ecf0f1;
      --gray: #7f8c8d;
    }
    
    * {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, #f9fbfd 0%, #eef5fd 100%);
      min-height: 100vh;
      padding-top: 80px;
    }
    
    .emergency-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .back-btn {
      background: linear-gradient(135deg, var(--secondary) 0%, #1a2530 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 10px 25px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);
      margin-bottom: 30px;
    }
    
    .back-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(44, 62, 80, 0.3);
    }
    
    .back-btn i {
      margin-right: 8px;
    }
    
    .page-title {
      text-align: center;
      font-weight: 700;
      color: var(--secondary);
      margin-bottom: 40px;
      position: relative;
      font-size: 2.5rem;
    }
    
    .page-title::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 5px;
      background: var(--primary);
      border-radius: 3px;
    }
    
    .service-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.4s ease;
      height: 100%;
      border: 2px solid transparent;
      position: relative;
      z-index: 1;
    }
    
    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: var(--accent);
      z-index: 2;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }
    
    .service-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
      border-color: var(--primary);
    }
    
    .service-card:hover::before {
      transform: scaleX(1);
    }
    
    .card-img-container {
      height: 200px;
      overflow: hidden;
      position: relative;
    }
    
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .service-card:hover .card-img {
      transform: scale(1.05);
    }
    
    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(44, 62, 80, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    .service-card:hover .card-overlay {
      opacity: 1;
    }
    
    .card-overlay-icon {
      background: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: var(--primary);
      animation: pulse 1.5s infinite;
    }
    
    .card-body {
      padding: 25px;
      position: relative;
      z-index: 1;
    }
    
    .card-title {
      color: var(--secondary);
      font-weight: 700;
      font-size: 1.5rem;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    
    .card-title i {
      margin-right: 12px;
      background: rgba(52, 152, 219, 0.1);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }
    
    .card-text {
      color: var(--gray);
      line-height: 1.7;
      margin-bottom: 20px;
    }
    
    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .urgent-section {
      background: linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%);
      border-radius: 15px;
      padding: 30px;
      margin-top: 50px;
      color: white;
      box-shadow: 0 10px 30px rgba(192, 57, 43, 0.2);
    }
    
    .urgent-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .urgent-icon {
      font-size: 2.5rem;
      margin-right: 20px;
      animation: pulse 1.5s infinite;
    }
    
    .urgent-content {
      margin-bottom: 25px;
      font-size: 1.1rem;
      line-height: 1.8;
    }
    
    .urgent-btn {
      background: white;
      color: #c0392b;
      border: none;
      border-radius: 50px;
      padding: 12px 30px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
    }
    
    .urgent-btn:hover {
      background: #f8f9fa;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .urgent-btn i {
      margin-right: 10px;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
      
      .card-img-container {
        height: 180px;
      }
    }
</style>