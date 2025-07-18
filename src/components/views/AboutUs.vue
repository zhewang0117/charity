<template>
  <div class="about-us-container">
    <div>
      <h1>About Us</h1>
    </div>
    <div v-for="section in sections" :key="section.id" class="section">
      <img :src="section.imageUrl" :alt="section.title" class="section-image">
      <h2 class="section-title">{{ section.title }}</h2>
      <p class="section-text">{{ section.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import aboutUsData from '@/assets/about-us.json';

const sections = ref([]);

onMounted(() => {
  sections.value = aboutUsData;
});
</script>

<style scoped>
.about-us-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
}

.section-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>