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
  min-height: 164px;
  padding: 24px 52px;

  ul {
    display: flex;
    gap: 24px;
    list-style: none;
    padding: 0;

    a {
      display: block;
      padding: 15px;
    }
  }

  @media (min-width: 992px) {
    margin-left: 100px;
    min-height: 214px;
  }
}
</style>
