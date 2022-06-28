<template>
  <v-app id="budget-calculator">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {};
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
  display: flex;
  flex-direction: column;
}
</style>
