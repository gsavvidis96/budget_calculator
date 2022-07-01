<template>
  <div class="component-wrapper">
    <v-progress-circular
      indeterminate
      color="primary"
      class="ma-auto"
      width="4"
      size="80"
    ></v-progress-circular>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  async created() {
    const idToken = await this.user.getIdToken(true);

    axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

    this.$router.push("/");
  },
};
</script>

<style lang="scss" scoped>
</style>