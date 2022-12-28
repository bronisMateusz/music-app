<template>
  <!-- Header -->
  <app-header />

  <!-- Main Content -->
  <main id="main">
    <navigation />
    <router-view />
  </main>

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth-modal />

  <!-- Footer -->
  <app-footer />
</template>

<script>
import AppHeader from "@/components/Header.vue";
import Navigation from "@/components/Navigation.vue";
import Player from "@/components/Player.vue";
import AuthModal from "@/components/AuthModal.vue";
import AppFooter from "@/components/Footer.vue";

export default {
  components: {
    AppHeader,
    Navigation,
    Player,
    AuthModal,
    AppFooter,
  },
};
</script>

<style lang="scss">
#main {
  flex-direction: column;
  padding: 164px 24px 48px;

  section > h2 {
    margin: 24px 0;
  }
}
@media (min-width: 992px) {
  #main {
    margin-left: 100px;
    padding-top: 108px;
  }
}
</style>
