<template>
  <v-app id="budget-calculator">
    <Navigation v-if="initialized" />

    <v-main>
      <!-- <v-btn @click="test">test</v-btn> -->

      <div class="component-wrapper" v-if="!initialized">
        <v-progress-circular
          indeterminate
          color="primary"
          class="ma-auto"
          width="4"
          size="80"
        ></v-progress-circular>
      </div>

      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation";
import { mapState } from "vuex";
import axios from "axios";

export default {
  components: {
    Navigation,
  },
  computed: {
    ...mapState({
      initialized: (state) => state.auth.initialized,
    }),
  },
  methods: {
    async test() {
      await axios.get("http://localhost:3000/budgets/get-budgets");
    },
  },
};
</script>

<style lang="scss">
#budget-calculator.v-application {
  .v-main__wrap {
    display: flex;
    flex-direction: column;
  }
}

//GLOBAL STYLES
.component-wrapper {
  flex-grow: 1;
  position: relative;
  padding: 16px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
}
</style>
