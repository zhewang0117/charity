import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAuthStore } from './store'


const app = createApp(App)
app.use(createPinia())
app.use(router)

// Initialize the auth store and fetch the user
const authStore = useAuthStore()
authStore.fetchUser()

app.mount('#app')
