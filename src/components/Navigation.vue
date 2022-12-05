<template>
  <nav id="main-nav">
    <!-- Auth Button -->
    <auth-button />
    <ul>
      <li>
        <a class="active" href="/" title="Home">
          <eva-icon name="home-outline" height="32" width="32" />
        </a>
      </li>
      <li>
        <a href="/favorites" title="Favorites">
          <eva-icon name="heart-outline" height="32" width="32" />
        </a>
      </li>
      <li>
        <a href="/library" title="Library">
          <eva-icon name="folder-outline" height="32" width="32" />
        </a>
      </li>
      <li>
        <a href="/discover" title="Discover">
          <eva-icon name="compass-outline" height="32" width="32" />
        </a>
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
    display: flex;
    gap: 52px;
    justify-content: center;
    list-style: none;
    padding: 0;

    a:not(.active) {
      color: $text-secondary;
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
      height: 100%;
      padding-bottom: 114px;
    }
  }
}
</style>
