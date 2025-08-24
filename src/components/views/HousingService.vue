<template>
  <div class="housing-service-page">
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white py-5">
      <div class="container">
        <button @click="goBack" class="btn btn-light mb-3">
          <i class="bi bi-arrow-left"></i> Back
        </button>
        <h1 class="display-4">
          <i class="bi bi-house-door display-4 me-3"></i>
          Housing Service
        </h1>
        <p class="lead">Safe and affordable housing assistance for individuals and families</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body p-4">
              <h3 class="text-primary mb-4">Housing Support Services</h3>
              
              <div class="service-item mb-4">
                <h5 class="text-success"><i class="bi bi-building me-2"></i>Temporary Housing</h5>
                <p class="text-muted">Emergency shelter and transitional housing options for individuals and families in immediate need of accommodation.</p>
              </div>

              <div class="service-item mb-4">
                <h5 class="text-success"><i class="bi bi-search me-2"></i>Housing Search Assistance</h5>
                <p class="text-muted">Help finding affordable rental properties, understanding lease agreements, and connecting with landlords.</p>
              </div>

              <div class="service-item mb-4">
                <h5 class="text-success"><i class="bi bi-currency-dollar me-2"></i>Financial Assistance</h5>
                <p class="text-muted">Support with security deposits, first month's rent, and connections to rental assistance programs.</p>
              </div>

              <div class="service-item mb-4">
                <h5 class="text-success"><i class="bi bi-file-text me-2"></i>Documentation Support</h5>
                <p class="text-muted">Assistance with housing applications, credit checks, and understanding tenant rights and responsibilities.</p>
              </div>

              <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Priority Housing:</strong> Families with children and vulnerable individuals receive priority placement.
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-clock me-2"></i>Office Hours</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Housing Office</strong><br>
                <span class="text-muted">Mon-Fri: 9:00 AM - 5:00 PM</span><br>
                <span class="text-muted">Saturday: 10:00 AM - 2:00 PM</span>
              </div>
              <div class="mb-3">
                <strong>Emergency Housing</strong><br>
                <span class="text-muted">24/7 Hotline Available</span>
              </div>
              <div class="mb-3">
                <strong>Walk-in Hours</strong><br>
                <span class="text-muted">Tue & Thu: 1:00 PM - 4:00 PM</span>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm mt-4">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0"><i class="bi bi-telephone me-2"></i>Contact Information</h5>
            </div>
            <div class="card-body">
              <p class="mb-2"><strong>Office:</strong> (555) 123-HOME</p>
              <p class="mb-2"><strong>Emergency:</strong> (555) 911-HELP</p>
              <p class="mb-2"><strong>Email:</strong> housing@carenexus.org</p>
              <p class="mb-0"><strong>Address:</strong> 456 Housing Ave, City</p>
            </div>
          </div>

          <div class="card border-0 shadow-sm mt-4">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="bi bi-list-check me-2"></i>Required Documents</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><i class="bi bi-check text-success me-2"></i>Photo ID</li>
                <li><i class="bi bi-check text-success me-2"></i>Proof of income (if available)</li>
                <li><i class="bi bi-check text-success me-2"></i>Social Security card (if available)</li>
                <li><i class="bi bi-check text-success me-2"></i>Birth certificates for children</li>
              </ul>
              <small class="text-muted">*Alternative documentation accepted</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HousingService',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.housing-service-page {
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

.service-item {
  padding: 1rem;
  border-left: 4px solid var(--color-primary, #007bff);
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
}

.text-success {
  color: hsla(160, 100%, 37%, 1) !important;
}
</style>