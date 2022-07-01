<template>
  <div class="component-wrapper">
    <v-btn
      class="mx-auto"
      color="primary"
      @click="onSendEmailVerification"
      :loading="loader"
      v-if="!emailSent"
      >Send Verification Email</v-btn
    >

    <template v-else>
      <v-alert border="top" color="success" class="align-self-center" dark>
        Email has been sent!
      </v-alert>

      <div class="body-2 text-center">
        Please, check your inbox or
        <v-btn
          text
          :loading="resendLoader"
          color="primary"
          small
          @click="onSendEmailVerification()"
          >resend email</v-btn
        >.
      </div>
    </template>
  </div>
</template>

<script>
import { sendEmailVerification } from "firebase/auth";
import { mapState } from "vuex";

export default {
  data() {
    return {
      loader: false,
      resendLoader: false,
      emailSent: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  methods: {
    async onSendEmailVerification() {
      this.loader = true;
      this.resendLoader = true;

      const actionCodeSettings = {
        url: "http://localhost:8080/email-verified",
        handleCodeInApp: true,
      };

      await sendEmailVerification(this.user, actionCodeSettings);

      this.loader = false;
      this.resendLoader = false;

      this.emailSent = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>