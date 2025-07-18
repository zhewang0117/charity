<template>
  <div class="container mt-5">
    <button @click="goBack" class="btn btn-secondary mb-4">Back</button>
    <h1>Food Service</h1>
    <p>Details about food services.</p>
  </div>
</template>

<script>
export default {
  name: 'FoodService',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>