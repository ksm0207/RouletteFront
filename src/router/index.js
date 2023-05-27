import { createRouter, createWebHistory } from 'vue-router'
// import Roulette from '../components/Roulette.vue'
import Home from '../views/Home.vue'
import GuestBookView from "@/views/GuestBookView.vue";

const routes = [
  {
    path: '/',
    component : Home
  },
  {
    path: '/guestBook',
    component : GuestBookView
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
