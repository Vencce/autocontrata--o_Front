import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/simulacao-clt',
      name: 'simulação-clt',
      component: () => import('../views/SimulacaoTrabalhadorCLTView.vue'),
    }
  ],
})

export default router
