[file name]: src/components/MyName.vue
[file content begin]
<template>
  <div class="name-display">
    <h2>{{ name }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Wang Zhe" // 替换为您的真实姓名
    }
  }
}
</script>

<style scoped>
.name-display {
  text-align: center;
  padding: 1.5rem;
  background-color: #f3f3f3;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 500px;
}

.name-display h2 {
  color: #42b983;
  font-size: 2rem;
}
</style>
[file content end]