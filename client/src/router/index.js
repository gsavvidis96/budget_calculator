import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true, role: ["USER"] }
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresUnauth: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async (to, from, next) => {
  //AUTHENTICATED ROUTES
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn) {
    return next("/login")
  }

  if (to.matched.some(record => record.meta.requiresUnauth) && store.getters.isLoggedIn) {
    return next("/")
  }

  next();
});

export default router
