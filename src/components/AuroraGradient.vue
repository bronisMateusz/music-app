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
      default: 0
    }
  },
  computed: {
    cssVars() {
      switch (this.variant) {
        case 1:
          return {
            '--color-first': '#FF6A37',
            '--color-second': '#FFD31F',
            '--color-third': '#FF3969',
            '--color-fourth': '#FF2528'
          }
        case 2:
          return {
            '--color-first': '#BBC0FF',
            '--color-second': '#00DDFF',
            '--color-third': '#79E9FF',
            '--color-fourth': '#327DF6'
          }
        case 3:
          return {
            '--color-first': '#F8CC7D',
            '--color-second': '#E85668',
            '--color-third': '#CD4B59',
            '--color-fourth': '#EBA572'
          }
        default:
          return {
            '--color-first': '#00ffe3',
            '--color-second': '#66ff00',
            '--color-third': '#ffb800',
            '--color-fourth': '#ff8bce'
          }
      }
    }
  }
}
</script>

<style lang="scss">
.aurora-gradient {
  position: relative;
  border-radius: 20px;
  isolation: isolate;
  width: 100%;
  height: 100%;
  overflow: hidden;

  div {
    position: absolute;
    filter: blur(20px) brightness(0.8);
    animation: gradient-move 4s infinite;
    border-radius: 50%;

    &:nth-child(1) {
      top: -10%;
      left: -30%;
      background-color: var(--color-first);
      width: 110%;
      height: 85%;
    }
    &:nth-child(2) {
      top: -15%;
      right: -10%;
      animation-delay: 2s;
      background-color: var(--color-second);
      width: 80%;
      height: 80%;
    }
    &:nth-child(3) {
      right: -20%;
      bottom: -15%;
      animation-delay: 0.3s;
      background-color: var(--color-third);
      width: 95%;
      height: 65%;
    }
    &:nth-child(4) {
      bottom: -10%;
      left: -30%;
      animation-delay: 1.2s;
      background-color: var(--color-fourth);
      width: 90%;
      height: 55%;
    }
  }

  @keyframes gradient-move {
    70% {
      transform: scale(1.2) translate(50px);
    }
  }
}
</style>
