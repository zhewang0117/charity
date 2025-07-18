<template>
  <div id="app">
    <!-- 导航栏应该放在顶部 -->
    <Navbar />
    
    <!-- 主要内容区域 -->
    <main class="container-fluid p-0"> <!-- 改为全宽容器 -->
      <div class="container mt-4"> <!-- 内容容器保持居中 -->
        <router-view />
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/shared/Navbar.vue'
import Footer from '@/components/shared/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
/* Global styles */
.container {
  min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
}
</style>