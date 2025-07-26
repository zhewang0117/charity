<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header">
            <h2>Support Us</h2>
          </div>
          <div class="card-body">
            <p class="lead">Thank you for your interest in supporting our cause. There are many ways you can contribute to our mission.</p>
            
            <div class="mt-4">
              <h4>Donate</h4>
              <p>Your financial contributions help us provide essential services to those in need. Every donation, no matter the size, makes a difference.</p>
              <router-link to="/donate" class="btn btn-primary">Donate Now</router-link>
            </div>

            <div class="mt-4">
              <h4>Volunteer</h4>
              <p>Give the gift of your time and skills. Our volunteers are the backbone of our organization, and we have a variety of roles available.</p>
              <router-link to="/volunteering" class="btn btn-secondary">Become a Volunteer</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>


<style>
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
    
    .support-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .support-card {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
      border: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      margin-bottom: 30px;
    }
    
    .support-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
    }
    
    .card-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 30px;
      border-bottom: 0;
      position: relative;
    }
    
    .card-header h2 {
      font-weight: 700;
      font-size: 2.5rem;
      margin: 0;
    }
    
    .card-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: var(--accent);
    }
    
    .card-body {
      padding: 40px;
    }
    
    .lead {
      font-size: 1.25rem;
      color: var(--secondary);
      line-height: 1.7;
      margin-bottom: 30px;
    }
    
    .support-option {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 30px;
      border: 1px solid rgba(52, 152, 219, 0.15);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
      transition: all 0.4s ease;
    }
    
    .support-option:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      border-color: rgba(52, 152, 219, 0.3);
    }
    
    .support-option h4 {
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-size: 1.6rem;
    }
    
    .support-option h4 i {
      margin-right: 15px;
      background: rgba(52, 152, 219, 0.1);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .support-option p {
      color: var(--gray);
      line-height: 1.8;
      margin-bottom: 25px;
    }
    
    .btn-donate {
      background: linear-gradient(135deg, var(--accent) 0%, #219653 100%);
      color: white;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      border: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
      display: inline-flex;
      align-items: center;
    }
    
    .btn-donate:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(39, 174, 96, 0.4);
    }
    
    .btn-donate i {
      margin-left: 8px;
    }
    
    .btn-volunteer {
      background: linear-gradient(135deg, var(--secondary) 0%, #1a2530 100%);
      color: white;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      border: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
      display: inline-flex;
      align-items: center;
    }
    
    .btn-volunteer:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(44, 62, 80, 0.4);
    }
    
    .impact-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border-radius: 20px;
      padding: 40px;
      color: white;
      margin-top: 50px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }
    
    .impact-section h3 {
      text-align: center;
      font-weight: 700;
      font-size: 1.8rem;
      margin-bottom: 30px;
      position: relative;
      padding-bottom: 15px;
    }
    
    .impact-section h3::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: var(--accent);
    }
    
    .impact-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    
    .impact-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      width: 220px;
      transition: all 0.3s ease;
    }
    
    .impact-card:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-5px);
    }
    
    .impact-card i {
      font-size: 3rem;
      margin-bottom: 15px;
      color: var(--accent);
    }
    
    .impact-card h4 {
      font-size: 1.3rem;
      margin-bottom: 10px;
    }
    
    .impact-card p {
      font-size: 0.95rem;
      opacity: 0.9;
    }
    
    .testimonial {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-top: 50px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border-left: 4px solid var(--accent);
    }
    
    .testimonial-content {
      font-style: italic;
      font-size: 1.2rem;
      color: var(--secondary);
      line-height: 1.8;
      margin-bottom: 20px;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
    }
    
    .testimonial-author img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
      border: 3px solid var(--accent);
    }
    
    .author-details h5 {
      font-weight: 700;
      margin-bottom: 0;
      color: var(--secondary);
    }
    
    .author-details p {
      color: var(--gray);
      margin-bottom: 0;
      font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
      body {
        padding-top: 60px;
      }
      
      .card-header {
        padding: 20px;
      }
      
      .card-header h2 {
        font-size: 2rem;
      }
      
      .card-body {
        padding: 25px;
      }
      
      .impact-cards {
        justify-content: space-around;
      }
      
      .impact-card {
        width: 45%;
        min-width: 150px;
      }
    }
    
    @media (max-width: 576px) {
      .impact-card {
        width: 100%;
      }
    }
  </style>