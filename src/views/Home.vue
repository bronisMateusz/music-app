<template></template>
<script></script>
<style lang="scss">
* {
  margin: 0;
  box-sizing: border-box;
}

a {
  color: $text-primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.hidden {
  display: none;
}

button {
  background-color: transparent;
  border-style: none;
  cursor: pointer;
  color: $text-secondary;

  &:hover {
    color: $text-primary;
  }
}

body {
  background-color: $color-canvas;
  color: $text-primary;
  font-family: "Josefin Sans", sans-serif;
  font-weight: 500;

  @include scrollbar-styles;

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .song-details {
      display: grid;
      grid-template-columns: 82px 1fr;
      grid-template-rows: repeat(2, 1fr);
      width: 100%;
      row-gap: 8px;

      .song-cover {
        background: conic-gradient(
          from 180deg at 50% 50%,
          #616db9 0deg,
          #bfc5fc 360deg
        );
        border-radius: 15px;
        height: 70px;
        grid-area: 1 / 1 / 3 / 2;
        width: 70px;
      }

      .song-title {
        align-self: end;
        font-weight: 700;
        grid-area: 1 / 2 / 2 / 3;
      }

      .song-artist {
        align-self: start;
        color: $text-secondary;
        grid-area: 2 / 2 / 3 / 3;
        font-size: 12px;
      }
    }
  }
}
</style>
