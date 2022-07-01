<template>
  <div>
    <v-app-bar app color="white" dense>
      <div class="text-h6">Budget Calculator</div>

      <div class="ml-auto" v-if="isLoggedIn">
        <v-btn small text @click="onLogout">Logout</v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
    async onLogout() {
      await this.logout();

      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>