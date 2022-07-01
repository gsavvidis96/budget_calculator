<template>
  <div class="component-wrapper align-center">
    <form @submit.prevent="submit" class="form d-flex flex-column" novalidate>
      <v-text-field
        outlined
        dense
        color="primary"
        label="Email"
        v-model="email"
        class="mb-1"
        :error-messages="emailErrors"
      ></v-text-field>

      <v-text-field
        outlined
        dense
        color="primary"
        label="Password"
        v-model="password"
        class="mb-1"
        :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
        :type="visibility ? 'text' : 'password'"
        :error-messages="passwordErrors"
        @click:append="visibility = !visibility"
      ></v-text-field>

      <v-text-field
        outlined
        dense
        color="primary"
        label="Confirm Password"
        v-model="confirmPassword"
        class="mb-1"
        :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
        :type="visibility ? 'text' : 'password'"
        :error-messages="confirmPasswordErrors"
        @click:append="visibility = !visibility"
      ></v-text-field>

      <div class="body-2 mb-6">
        Already have an account? <a @click="$router.push('/login')">Login</a>
      </div>

      <v-btn
        color="primary"
        type="submit"
        :disabled="!email || !password || !confirmPassword"
        :loading="loader"
        >Signup</v-btn
      >
    </form>
  </div>
</template>

<script>
import { required, email, sameAs, minLength } from "vuelidate/lib/validators";
import axios from "axios";
import { mapActions } from "vuex";

const uniqueEmail = function () {
  return !this.emailExists;
};

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      visibility: false,
      emailExists: false,
      loader: false,
    };
  },
  validations: {
    email: { required, email, uniqueEmail },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, sameAsPassword: sameAs("password") },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.email) errors.push("Must be a valid email");
      if (!this.$v.email.uniqueEmail) errors.push("Email already exists");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.minLength)
        errors.push("Password must be at least 6 characters long");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      if (!this.$v.confirmPassword.sameAsPassword)
        errors.push("Passwords do not match");
      return errors;
    },
  },
  methods: {
    ...mapActions(["login"]),
    async submit() {
      this.emailExists = false;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.loader = true;

      try {
        const res = await axios.post("http://localhost:3000/auth/signup", {
          email: this.email,
          password: this.password,
        });

        await this.login(res.data.token);

        this.$router.push("/");
      } catch (e) {
        if (e.response.status == 400) {
          this.emailExists = true;
        }
      }

      this.loader = false;
    },
  },
  watch: {
    email(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.emailExists = false;
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
