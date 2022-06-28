import axios from 'axios';

export default {
    state: {
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null
    },
    getters: {
        isLoggedIn: state => !!state.token
    },
    mutations: {
        login(state, user) {
            state.token = user.token;
            state.role = user.role;
        },
        logout(state) {
            state.token = null;
            state.role = null;
        }
    },
    actions: {
        async login({ commit, dispatch }, credentials) {

        },
        async logout({ commit }) {

        }
    }
}
