import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import EmailVerified from '../views/EmailVerified.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true, emailVerified: true, role: ["USER"] }
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresUnauth: true }
  },
  {
    path: '/signup',
    component: Signup,
    meta: { requiresUnauth: true }
  },
  {
    path: '/verify-email',
    component: VerifyEmail,
    meta: { requiresAuth: true, requiresEmailUnverified: true }
  },
  {
    path: '/email-verified',
    component: EmailVerified,
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {

  //if requires auth
  if (to.matched.some(record => record.meta.requiresAuth)) {

    //if not logged in then navigate to login
    if (!store.getters.isLoggedIn) {
      return next("/login")
    }

    if (!to.matched.some(record => record.meta.requiresEmailUnverified) && !store.state.auth.user?.emailVerified) {
      return next("/verify-email")
    }

    if (to.matched.some(record => record.meta.requiresEmailUnverified) && store.state.auth.user?.emailVerified) {
      return next("/")
    }
  }

  if (to.matched.some(record => record.meta.requiresUnauth) && store.getters.isLoggedIn) {
    return next("/")
  }

  next();
});

export default router;