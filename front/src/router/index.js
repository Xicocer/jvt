/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
// import { createRouter, createWebHistory } from 'vue-router/auto'
// import { setupLayouts } from 'virtual:generated-layouts'
// import { routes } from 'vue-router/auto-routes'
// import { useAuthStore } from '@/stores/auth.store'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: setupLayouts(routes),
// })

// // Workaround for https://github.com/vitejs/vite/issues/11804
// router.onError((err, to) => {
//   if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
//     if (!localStorage.getItem('vuetify:dynamic-reload')) {
//       console.log('Reloading page to fix dynamic import error')
//       localStorage.setItem('vuetify:dynamic-reload', 'true')
//       location.assign(to.fullPath)
//     } else {
//       console.error('Dynamic import error, reloading page did not fix it', err)
//     }
//   } else {
//     console.error(err)
//   }
// })

// router.isReady().then(() => {
//   localStorage.removeItem('vuetify:dynamic-reload')
// })

// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore()

//   const layout = to.meta.layout

//   // layout "auth" требует авторизации
//   if (layout === 'auth' && !auth.isAuthenticated) {
//     return next('/login')
//   }

//   // layout "admin" требует роль админа
//   if (layout === 'admin' && !auth.isAdmin) {
//     return next('/')
//   }

//   next()
// })

// export default router

import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'
import index from '@/pages/index.vue'
import AdminPanel from '@/pages/AdminPanel.vue'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'
import MyMessanger from '@/pages/MyMessanger.vue'

const routes = [
  {
    path: '/',
    component: index,
    meta: { requiresAuth: true }
  },
  {
    path: '/AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path:'/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path:'/messenger',
    component: MyMessanger,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    component: Register,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/')
  }

  next()
})

export default router;