<template>
  <div class="container mt-5">
        <button @click="goBack" class="btn btn-secondary mb-4">Back</button>
    <h1 class="text-center mb-4">Emergency Help</h1>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <router-link to="/food-service" class="card-link">
          <div class="card">
            <img src="https://via.placeholder.com/300x200.png?text=Food" class="card-img-top" alt="Food Service">
            <div class="card-body">
              <h5 class="card-title">Food</h5>
              <p class="card-text">Find local food banks and resources.</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/housing-service" class="card-link">
          <div class="card">
            <img src="https://via.placeholder.com/300x200.png?text=Housing" class="card-img-top" alt="Housing Service">
            <div class="card-body">
              <h5 class="card-title">Housing</h5>
              <p class="card-text">Get assistance with shelter and housing.</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/medical-service" class="card-link">
          <div class="card">
            <img src="https://via.placeholder.com/300x200.png?text=Medical" class="card-img-top" alt="Medical Service">
            <div class="card-body">
              <h5 class="card-title">Medical Service</h5>
              <p class="card-text">Access to medical care and support.</p>
            </div>
          </div>
        </router-link>
      </div>
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
.card-link {
  text-decoration: none;
  color: inherit;
}
.card {
  transition: transform .2s;
}
.card:hover {
  transform: scale(1.05);
}
</style>