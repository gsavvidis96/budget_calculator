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

      <v-btn color="white" @click="onFacebookLogin">
        <v-icon left>mdi-facebook</v-icon>
        Continue with Facebook
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import { auth } from "@/firebase";
import {
  signOut,
  FacebookAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { FacebookLogin } from "@capacitor-community/facebook-login";
import { mapState } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      loader: false,
      wrongCredentials: null,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
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
        //login with google and get idtoken
        const google = await GoogleAuth.signIn();

        const res = await axios.post(
          "http://localhost:3000/auth/provider-login",
          {
            providerToken: google.authentication.idToken,
            provider: "GOOGLE",
          }
        );

        //then login (with custom token)
        await this.login(res.data.token);

        await GoogleAuth.signOut();

        this.$router.push("/");
      } catch (e) {
        await signOut(auth);
        await GoogleAuth.signOut();
      }
    },
    async onFacebookLogin() {
      try {
        const FACEBOOK_PERMISSIONS = ["email", "public_profile"];

        const facebook = await FacebookLogin.login({
          permissions: FACEBOOK_PERMISSIONS,
        });

        const res = await axios.post(
          "http://localhost:3000/auth/provider-login",
          {
            providerToken: facebook.accessToken.token,
            provider: "FACEBOOK",
          }
        );

        //then login (with custom token)
        await this.login(res.data.token);

        console.log(this.user);

        // const found = this.user.providerData.find(
        //   (provider) => provider.providerId == "facebook.com"
        // );

        // if (!found) {
        //   const credential = FacebookAuthProvider.credential(
        //     facebook.accessToken.token
        //   );

        //   await linkWithCredential(this.user, credential);
        // }

        await FacebookLogin.logout();

        this.$router.push("/");
      } catch (e) {
        console.log(e);
        await signOut(auth);
        await FacebookLogin.logout();
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
