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
    variant: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    cssVars() {
      switch (this.variant) {
        case 0:
          return {
            "--color-first": "#00ffe3",
            "--color-second": "#66ff00",
            "--color-third": "#ffb800",
            "--color-fourth": "#ff8bce",
          };
        case 1:
          return {
            "--color-first": "#FF6A37",
            "--color-second": "#FFD31F",
            "--color-third": "#FF3969",
            "--color-fourth": "#FF2528",
          };
        case 2:
          return {
            "--color-first": "#BBC0FF",
            "--color-second": "#00DDFF",
            "--color-third": "#79E9FF",
            "--color-fourth": "#327DF6",
          };
        case 3:
          return {
            "--color-first": "#F8CC7D",
            "--color-second": "#E85668",
            "--color-third": "#CD4B59",
            "--color-fourth": "#EBA572",
          };
      }
    },
  },
};
</script>

<style lang="scss">
.aurora-gradient {
  border-radius: 20px;
  height: 100%;
  isolation: isolate;
  overflow: hidden;
  position: relative;
  width: 100%;

  div {
    animation: gradient-move 4s infinite;
    border-radius: 50%;
    filter: blur(20px) brightness(0.8);
    position: absolute;

    &:nth-child(1) {
      height: 85%;
      width: 110%;
      background-color: var(--color-first);
      left: -30%;
      top: -10%;
    }
    &:nth-child(2) {
      height: 80%;
      width: 80%;
      background-color: var(--color-second);
      top: -15%;
      right: -10%;
      animation-delay: 2s;
    }
    &:nth-child(3) {
      height: 65%;
      width: 95%;
      background-color: var(--color-third);
      bottom: -15%;
      right: -20%;
      animation-delay: 0.3s;
    }
    &:nth-child(4) {
      height: 55%;
      width: 90%;
      background-color: var(--color-fourth);
      bottom: -10%;
      left: -30%;
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
