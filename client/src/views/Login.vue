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
      ></v-text-field>

      <v-text-field
        outlined
        dense
        color="primary"
        label="Password"
        type="password"
        v-model="password"
        class="mb-1"
      ></v-text-field>

      <div class="body-2 mb-1">
        Don't have an account? <a @click="$router.push('/signup')">Sign up</a>
      </div>

      <div class="body-2 mb-6">
        Forgot you password? Click <a to="/signup">here</a>
      </div>

      <v-btn color="primary" type="submit" :disabled="!email || !password"
        >Login</v-btn
      >
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      console.log("hi");
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}
</style>
