<template>
  <!-- Header -->
  <app-header />

  <!-- Main Content -->
  <main id="main">
    <app-navigation />
    <router-view />
  </main>

  <!-- Player -->
  <app-player />

  <!-- Auth Modal -->
  <auth-modal />

  <!-- Footer -->
  <app-footer />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppNavigation from '@/components/AppNavigation.vue'
import AppPlayer from '@/components/AppPlayer.vue'
import AuthModal from '@/components/AuthModal.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppNavigation,
    AppPlayer,
    AuthModal,
    AppFooter
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/variables.scss' as *;

#main {
  flex-direction: column;
  padding: 164px 24px 48px;

  section > h2 {
    margin: 24px 0;
  }
}
@media (min-width: $lg) {
  #main {
    margin-left: 100px;
    padding-top: 103px;
  }
}
</style>
