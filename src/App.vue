<template>
  <!-- Header -->
  <app-header />

  <!-- Main Content -->
  <main>
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
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    Navigation,
    Player,
    AuthModal,
    AppFooter,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) this.userLoggedIn = true;
  },
};
</script>

<style lang="scss">
main {
  padding: 164px 24px 48px;
  flex-direction: column;

  section > h2 {
    margin: 24px 0;
  }
}
@media (min-width: 992px) {
  main {
    margin-left: 100px;
    padding-top: 108px;
  }
}
</style>
