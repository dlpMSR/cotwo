<template>
  <header>
    <v-tabs align-tabs="end" color="deep-purple-accent-4">
      <v-tab to="/" style="text-transform: none;">Home</v-tab>
      <v-tab to="/chart" style="text-transform: none;">Chart</v-tab>
    </v-tabs>
  </header>

  <div class="main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped lang="scss">
@import '@/assets/sass/mixin.scss';

header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

main {
  padding-top: 50px;
}

.v-tab {
  @include LatoBold;

  font-size: 1.3rem;
  font-weight: bolder;
  color: #404040;
}
</style>
