<template>
  <nav id="main-nav">
    <ul>
      <li></li>
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

<script></script>
<style lang="scss">
#main-nav {
  @include blurred-bg;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 17px;

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
    right: inherit;
    top: 0;
    width: 100px;

    ul {
      align-items: center;
      flex-direction: column;
      height: 100%;
    }
  }
}
</style>
