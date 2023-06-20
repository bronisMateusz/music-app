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
  align-items: flex-start;
  background-color: rgba($color: $color-element, $alpha: 0.25);
  display: flex;
  margin-top: auto;
  min-height: 273px;
  padding: 24px 52px;

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
