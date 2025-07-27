<template>
  <div id="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/shared/Navbar.vue';
import Footer from '@/components/shared/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1400px; /* Centered content */
  margin: 0 auto;
  padding: 1.5rem;
  padding-top: 120px; /* Add padding to offset the fixed navbar */
}

/* Responsive adjustments */
@media (max-width: var(--breakpoint-lg)) {
  .main-content {
    padding: 1.2rem;
  }
}

@media (max-width: var(--breakpoint-md)) {
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: var(--breakpoint-sm)) {
  .main-content {
    padding: 0.8rem;
  }
}
</style>