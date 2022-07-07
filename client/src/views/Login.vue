<template>
  <div class="component-wrapper align-center">
    <form @submit.prevent="submit" class="form d-flex flex-column" novalidate>
      <v-text-field
        outlined
        dense
        color="primary"
        label="Email"
        type="email"
        v-model="email"
        class="mb-1"
        :error="wrongCredentials"
      ></v-text-field>

      <v-text-field
        outlined
        dense
        color="primary"
        label="Password"
        type="password"
        v-model="password"
        class="mb-1"
        :error="wrongCredentials"
      ></v-text-field>

      <div
        class="body-2 error--text font-weight-bold mb-4"
        v-if="wrongCredentials"
      >
        Invalid Credentials
      </div>

      <div class="body-2 mb-1">
        Don't have an account? <a @click="$router.push('/signup')">Sign up</a>
      </div>

      <div class="body-2 mb-6">
        Forgot you password? Click
        <a @click="$router.push('/forgot-password')">here</a>
      </div>

      <v-btn
        color="primary"
        type="submit"
        :disabled="!email || !password"
        :loading="loader"
        >Login</v-btn
      >
    </form>

    <div class="form d-flex flex-column">
      <div class="d-flex align-center my-6">
        <v-divider></v-divider>

        <div class="body-1 mx-6">OR</div>

        <v-divider></v-divider>
      </div>

      <v-btn @click="onGoogleLogin" color="white" class="mb-4">
        <v-icon left>mdi-google</v-icon>
        Continue with Google
      </v-btn>

      <v-btn color="white">
        <v-icon left>mdi-google</v-icon>
        Continue with Facebook
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import { auth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      loader: false,
      wrongCredentials: null,
    };
  },
  methods: {
    ...mapActions(["login"]),
    async submit() {
      this.wrongCredentials = null;
      this.loader = true;

      try {
        const res = await axios.post("http://localhost:3000/auth/login", {
          email: this.email,
          password: this.password,
        });

        await this.login(res.data.token);

        this.$router.push("/");
      } catch (e) {
        if (e.response.status == 401) {
          this.wrongCredentials = true;
        }
      }

      this.loader = false;
    },
    async onGoogleLogin() {
      try {
        //first login (without custom token)
        const googleRes = await signInWithPopup(auth, new GoogleAuthProvider());

        const idToken = await googleRes.user.getIdToken();

        console.log(idToken);

        // //add idToken to auth header
        // axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

        //call providerLogin to issue custom token (and create user in our database if it is the first login)
        const res = await axios.post(
          "http://localhost:3000/auth/provider-login",
          {
            idToken,
          }
        );

        //signout of the non custom token session
        await signOut(auth);

        //then login (with custom token)
        await this.login(res.data.token);

        this.$router.push("/");
      } catch (error) {
        await signOut(auth);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
