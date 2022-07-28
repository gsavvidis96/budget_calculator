<template>
  <div class="component-wrapper align-center">
    <form @submit.prevent="submit" class="form d-flex flex-column" novalidate>
      <div class="text-h6 text-center mb-1">Forgot your password?</div>

      <div class="body-1 text-center mb-6">
        Please enter your email and you will receive a link to create a new
        password.
      </div>

      <v-text-field
        outlined
        dense
        color="primary"
        label="Email"
        type="email"
        v-model="email"
        class="mb-1"
      ></v-text-field>

      <v-btn
        color="primary"
        type="submit"
        :disabled="!email"
        :loading="loader"
        class="mb-4"
        >Reset Password</v-btn
      >

      <a class="body-2 text-center" @click="$router.push('/login')"
        >Back to Login</a
      >

      <v-alert
        border="top"
        text
        color="success"
        dark
        class="text-center mt-6"
        v-if="showAlert"
      >
        Email has been sent!
      </v-alert>
    </form>
  </div>
</template>

<script>
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.js";

export default {
  data() {
    return {
      email: "",
      loader: false,
      showAlert: false,
    };
  },
  methods: {
    async submit() {
      this.loader = true;

      try {
        await sendPasswordResetEmail(auth, this.email);

        this.email = "";
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      } catch (e) {
        console.log(e);
      }

      this.loader = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>