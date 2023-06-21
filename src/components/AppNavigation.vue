<template>
  <nav id="main-nav">
    <!-- Auth Button -->
    <auth-button />
    <ul>
      <li>
        <router-link :to="{ name: 'home' }" title="Home">
          <eva-icon name="home-outline" height="32" width="32" />
        </router-link>
      </li>
      <li v-if="userLoggedIn">
        <router-link :to="{ name: 'favorites' }" title="Favorites">
          <eva-icon name="heart-outline" height="32" width="32" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'discover' }" title="Discover">
          <eva-icon name="compass-outline" height="32" width="32" />
        </router-link>
      </li>
      <li v-if="accountType">
        <router-link :to="{ name: 'uploads' }" title="Upload">
          <eva-icon name="cloud-upload-outline" height="32" width="32" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import AuthButton from '@/components/AuthButton.vue'
import { mapState } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  components: { AuthButton },
  computed: {
    ...mapState(useUserStore, ['accountType', 'userLoggedIn'])
  }
}
</script>
<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#main-nav {
  @include blurred-bg($color-element);
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 17px;

  .auth-btn-wrapper {
    display: none;
  }

  > ul {
    @include hidden-list-marks;
    display: flex;
    justify-content: space-around;

    a:not(.router-link-active) {
      color: $text-secondary;

      &:hover {
        color: $text-primary;
      }
    }
  }

  @media (min-width: $lg) {
    top: 0;
    right: inherit;
    padding: 36px 20px;

    .auth-btn-wrapper {
      display: block;
    }

    > ul {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 52px;
      padding-bottom: 114px;
      height: 100%;
    }
  }
}
</style>
