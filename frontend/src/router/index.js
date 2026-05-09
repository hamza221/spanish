import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import { modules } from '../modules/registry.js'

const moduleRoutes = modules
  .filter((m) => m.status === 'active')
  .map((m) => ({
    path: `/modules/${m.id}`,
    component: () => import(`../modules/${m.id}/index.vue`),
    meta: { module: m },
  }))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView, meta: { title: 'Hub' } },
    ...moduleRoutes,
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

router.afterEach((to) => {
  const title = to.meta?.module?.name ?? to.meta?.title
  document.title = title ? `${title} — Español` : 'Español'
})

export default router
