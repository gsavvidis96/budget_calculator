import { auth } from "@/firebase";
import { signOut, signInWithCustomToken } from "firebase/auth";
import axios from "axios";

export default {
  state: {
    initialized: false,
    user: null,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  mutations: {
    initializeAuthState(state) {
      state.initialized = true;
    },
    login(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, token) {
      const res = await signInWithCustomToken(auth, token);

      const idToken = await res.user.getIdToken();

      axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      commit("login", res.user);
    },
    async logout({ commit }) {
      await signOut(auth);

      commit("logout");
    },
  },
};
