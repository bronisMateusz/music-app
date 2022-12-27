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
      <li>
        <router-link :to="{ name: 'favorites' }" title="Favorites">
          <eva-icon name="heart-outline" height="32" width="32" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'library' }" title="Library">
          <eva-icon name="folder-outline" height="32" width="32" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'discover' }" title="Discover">
          <eva-icon name="compass-outline" height="32" width="32" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'upload' }" title="Upload">
          <eva-icon name="cloud-upload-outline" height="32" width="32" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import AuthButton from "@/components/AuthButton.vue";

export default {
  components: { AuthButton },
};
</script>
<style lang="scss">
#main-nav {
  @include blurred-bg;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 17px;

  .auth-btn {
    display: none;
  }

  ul {
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

  @media (min-width: 992px) {
    padding: 36px 20px;
    right: inherit;
    top: 0;

    .auth-btn {
      display: initial;
    }

    ul {
      align-items: center;
      flex-direction: column;
      gap: 52px;
      height: 100%;
      justify-content: center;
      padding-bottom: 114px;
    }
  }
}
</style>
