<template>
  <div class="container mt-5">
    <button @click="goBack" class="btn btn-secondary mb-4">Back</button>
    <h1>Medical Service</h1>
    <p>Details about medical services.</p>
  </div>
</template>

<script>
export default {
  name: 'MedicalService',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>