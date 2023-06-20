<template>
  <footer id="footer">
    <ul>
      <li>
        <a href="#">Cookies</a>
      </li>
      <li>
        <a href="#">Privacy</a>
      </li>
    </ul>
  </footer>
</template>

<style lang="scss">
#footer {
  display: flex;
  align-items: flex-start;
  margin-top: auto;
  background-color: rgba($color: $color-element, $alpha: 0.25);
  padding: 24px 52px;
  min-height: 273px;

  ul {
    @include hidden-list-marks;
    display: flex;
    gap: 24px;

    a {
      display: block;
      padding: 15px;
    }
  }

  @media (min-width: $lg) {
    margin-left: 100px;
    min-height: 214px;
  }
}
</style>
