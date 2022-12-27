<template>
  <div class="aurora-gradient" :style="cssVars">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    colorFirst: {
      type: String,
      default: "#00ffe3",
    },
    colorSecond: {
      type: String,
      default: "#66ff00",
    },
    colorThird: {
      type: String,
      default: "#ffb800",
    },
    colorFourth: {
      type: String,
      default: "#ff8bce",
    },
  },
  computed: {
    cssVars() {
      return {
        "--color-first": this.colorFirst,
        "--color-second": this.colorSecond,
        "--color-third": this.colorThird,
        "--color-fourth": this.colorFourth,
      };
    },
  },
};
</script>

<style lang="scss">
.aurora-gradient {
  border-radius: 20px;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: -1;

  &::after {
    backdrop-filter: blur(40px);
    content: "";
    height: 100%;
    position: absolute;
    width: 100%;
  }

  div {
    position: absolute;
    border-radius: 50%;
    animation: gradient-move 4s infinite;

    &:nth-child(1) {
      height: 90%;
      width: 80%;
      background-color: var(--color-first);
      left: -20%;
      top: -10%;
    }
    &:nth-child(2) {
      height: 80%;
      width: 70%;
      background-color: var(--color-second);
      top: -12%;
      right: -12%;
      animation-delay: 2s;
    }
    &:nth-child(3) {
      height: 65%;
      width: 80%;
      background-color: var(--color-third);
      bottom: -15%;
      right: -20%;
      animation-delay: 0.3s;
    }
    &:nth-child(4) {
      height: 50%;
      width: 75%;
      background-color: var(--color-fourth);
      bottom: -10%;
      left: -18%;
      animation-delay: 1.2s;
    }
  }

  @keyframes gradient-move {
    70% {
      transform: scale(1.2) translate(50px);
    }
  }
}
</style>
