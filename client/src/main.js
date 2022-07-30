import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import Vuelidate from "vuelidate";
import axios from "axios";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from "@capacitor-community/facebook-login";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

onAuthStateChanged(auth, async (user) => {
  console.log(user);

  if (!store.state.auth.initialized) {
    if (user) {
      const idToken = await user.getIdToken();

      axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      store.commit("login", user);
    }

    GoogleAuth.initialize({
      clientId: '403312219841-va3vg8me6fo1srhd1sgi542753rb3ilm.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    await FacebookLogin.initialize({ appId: '3132025003725648' });

    store.commit("initializeAuthState");

    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
