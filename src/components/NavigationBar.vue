<template>
  <nav class="navbar">
    <div class="logo" @click="goHome">
      <img src="./assets/logo.png" alt="Website Logo">
    </div>
    <ul class="nav-links">
            <li v-for="(link, index) in links" :key="index">
        <a :href="link.url">{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      links: [
        { text: 'GET HELP', url: '#' },
        { text: 'VOLUNTEER HUB', url: '#' },
        { text: 'SUPPORT US', url: '#' },
        { text: 'ABOUT US', url: '#' },
        { text: '联系我们', url: '#' }
      ]
    }
  },
  methods: {
    // 定义回到主页的方法
    goHome() {
      window.location.href = '/'; // 这里假设主页路径为根路径，可根据实际情况修改
    }
  }
}
</script>


<style scoped>

.navbar {
  background-color: #1456b9;
  /* 设置左右内边距，让导航栏左右有空白 */
  padding: 0 40px; 
  height: 60px;
  display: flex;
  /* 均匀分布元素，让 logo 和列表元素间距一致 */
  justify-content: space-between; 
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo {
  /* 修改为适应图片的样式 */
  height: 100%; 
  display: flex;
  align-items: center;
}

.logo img {
  /* 设置图片的最大高度，避免超出导航栏 */
  max-height: 100%; 
  width: auto;
}

.nav-links {
  display: flex;
  /* 设置列表项之间的间距 */
  gap: 40px; 
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links li {
  /* 移除原有的左外边距 */
  margin-left: 0; 
}

.nav-links a {
  text-decoration: none;
  color: #4a5568;
  font-weight: 600;
  font-size: 1.5rem;
  transition: color 0.3s;
  padding: 5px 5px;
  position: relative;
}

.nav-links a:hover {
  color: #3498db;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #3498db;
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    margin-top: 15px;
    /* 在小屏幕下重新设置列表项间距 */
    gap: 10px; 
  }

  .nav-links li {
    margin: 0;
    text-align: center;
  }
}
</style>
