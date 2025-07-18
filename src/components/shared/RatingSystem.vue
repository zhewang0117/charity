<template>
  <div class="rating-system">
    <h5>评分系统</h5>
    
    <!-- 显示平均分 -->
    <div class="average-rating mb-3">
      <strong>平均评分:</strong>
      <span class="rating-stars">
        <i v-for="star in 5" :key="star" 
           :class="['bi', star <= Math.floor(average) ? 'bi-star-fill' : 'bi-star']"></i>
      </span>
      <span>({{ average.toFixed(1) }})</span>
      <span class="ms-2">基于 {{ ratingsCount }} 个评价</span>
    </div>
    
    <!-- 用户评分 -->
    <div v-if="userCanRate" class="user-rating">
      <p>您的评分:</p>
      <div class="star-rating">
        <i v-for="star in 5" :key="star" 
           :class="['bi', star <= userRating ? 'bi-star-fill' : 'bi-star']"
           @click="setRating(star)"
           @mouseover="hoverRating = star"
           @mouseleave="hoverRating = 0"></i>
      </div>
      <button v-if="userRating > 0" class="btn btn-sm btn-primary mt-2" @click="submitRating">
        提交评分
      </button>
    </div>
    
    <div v-else-if="isAuthenticated">
      <p class="text-muted">您已评分</p>
    </div>
    <div v-else>
      <p class="text-muted">请<a href="/login">登录</a>后进行评分</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/store'
import { useResourceStore } from '@/store'

const props = defineProps({
  resourceId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const resourceStore = useResourceStore()

const userRating = ref(0)
const hoverRating = ref(0)
const hasRated = ref(false)

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userId = computed(() => authStore.user?.id)
const resource = computed(() => 
  resourceStore.resources.find(r => r.id === props.resourceId))

const ratings = computed(() => resource.value?.ratings || [])
const ratingsCount = computed(() => ratings.value.length)
const average = computed(() => {
  if (ratingsCount.value === 0) return 0
  const total = ratings.value.reduce((sum, r) => sum + r.rating, 0)
  return total / ratingsCount.value
})

const userCanRate = computed(() => 
  isAuthenticated.value && 
  !hasRated.value && 
  userId.value !== resource.value?.userId
)

// 设置评分
const setRating = (rating) => {
  userRating.value = rating
}

// 提交评分
const submitRating = () => {
  if (userCanRate.value && userRating.value > 0) {
    resourceStore.addRating(props.resourceId, userRating.value)
    hasRated.value = true
  }
}

// 检查用户是否已评分
watch(() => resource.value, (newResource) => {
  if (newResource && userId.value) {
    hasRated.value = newResource.ratings.some(r => r.userId === userId.value)
  }
}, { immediate: true })
</script>

<style scoped>
.star-rating {
  color: #ffc107;
  font-size: 1.5rem;
  cursor: pointer;
}
.bi-star-fill {
  color: #ffc107;
}
</style>