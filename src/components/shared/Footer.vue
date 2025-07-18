<template>
  <footer class="footer mt-auto py-4 bg-dark text-white">
    <div class="container">
      <div class="row">
        <!-- 网站信息栏目 -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="text-primary mb-3">Immigrant Health Support</h5>
          <p class="mb-3">
            Empowering immigrant communities with healthcare resources, support, and education.
          </p>
          <div class="social-icons">
            <a href="#" class="text-white me-3">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="text-white me-3">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="text-white me-3">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="text-white">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
        
        <!-- 快速导航栏目 -->
        <div class="col-md-2 mb-4 mb-md-0">
          <h5 class="mb-3">Quick Links</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/" class="text-white text-decoration-none">Home</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/resources" class="text-white text-decoration-none">Resources</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/community" class="text-white text-decoration-none">Community</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/about" class="text-white text-decoration-none">About Us</router-link>
            </li>
          </ul>
        </div>
        
        <!-- 资源栏目 -->
        <div class="col-md-3 mb-4 mb-md-0">
          <h5 class="mb-3">Resources</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/resources/healthcare" class="text-white text-decoration-none">Healthcare Access</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/resources/legal" class="text-white text-decoration-none">Legal Assistance</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/resources/education" class="text-white text-decoration-none">Education</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/resources/mental-health" class="text-white text-decoration-none">Mental Health Support</router-link>
            </li>
          </ul>
        </div>
        
        <!-- 联系信息栏目 -->
        <div class="col-md-3">
          <h5 class="mb-3">Contact Us</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <i class="bi bi-geo-alt me-2 text-primary"></i> 
              123 Health St, Toronto, ON
            </li>
            <li class="mb-2">
              <i class="bi bi-telephone me-2 text-primary"></i> 
              +1 (416) 123-4567
            </li>
            <li class="mb-2">
              <i class="bi bi-envelope me-2 text-primary"></i> 
              info@immigranthealth.org
            </li>
            <li class="mb-2">
              <i class="bi bi-clock me-2 text-primary"></i> 
              Mon-Fri: 9am - 5pm
            </li>
          </ul>
          
          <!-- 订阅表单 -->
          <div class="mt-4">
            <h6 class="mb-2">Subscribe to our newsletter</h6>
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Your email">
              <button class="btn btn-primary" type="button">
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <hr class="border-secondary my-4">
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; {{ currentYear }} Immigrant Health Support. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <ul class="list-inline mb-0">
            <li class="list-inline-item">
              <router-link to="/privacy" class="text-white text-decoration-none">Privacy Policy</router-link>
            </li>
            <li class="list-inline-item mx-2">|</li>
            <li class="list-inline-item">
              <router-link to="/terms" class="text-white text-decoration-none">Terms of Use</router-link>
            </li>
            <li class="list-inline-item mx-2">|</li>
            <li class="list-inline-item">
              <router-link to="/sitemap" class="text-white text-decoration-none">Sitemap</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50, #1a2530);
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
}

.footer a {
  transition: all 0.3s ease;
}

.footer a:hover {
  color: #4da8ff !important;
  padding-left: 5px;
}

.social-icons i {
  font-size: 1.4rem;
  transition: transform 0.3s ease;
}

.social-icons a:hover i {
  transform: translateY(-3px);
  color: #4da8ff !important;
}

.input-group .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

hr {
  opacity: 0.2;
}
</style>