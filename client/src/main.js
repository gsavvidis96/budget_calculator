import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import { auth } from "./firebase.js"
import { onAuthStateChanged } from "firebase/auth";
import Vuelidate from 'vuelidate'
import axios from "axios";

Vue.config.productionTip = false

Vue.use(Vuelidate)

onAuthStateChanged(auth, async (user) => {
  if (!store.state.auth.initialized) {
    if (user) {
      const idToken = await user.getIdToken();

      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

      store.commit("login", user);
    }

    store.commit("initializeAuthState");

    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});

