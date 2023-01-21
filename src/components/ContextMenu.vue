<template>
  <div class="context-menu" ref="contextMenu">
    <slot />
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener("mouseup", this.onClickOutside);
  },
  unmounted() {
    document.removeEventListener("mouseup", this.onClickOutside);
  },
  methods: {
    closeMenu() {
      this.$emit("closeMenu");
    },

    onClickOutside(event) {
      const target = event.target;
      const contextMenu = this.$refs.contextMenu;

      if (!contextMenu.parentElement.contains(target)) this.closeMenu();
    },
  },
};
</script>

<style lang="scss">
.context-menu {
  position: absolute;
  right: 0;
  top: -50%;
  transform: translateY(-50%);

  &::after {
    @include blurred-bg($color-element);
    content: "";
    border-radius: 8px;
    inset: 0;
    position: absolute;
    z-index: -1;
  }

  ul {
    @include hidden-list-marks;
    text-align: right;

    a,
    button {
      padding: 12px 24px 12px 48px;
    }

    a {
      display: block;
      border-bottom: 1px solid $color-border-primary;
      text-decoration: none;

      &:not(:hover):not(.router-link-active) {
        color: $text-secondary;
      }
    }
    button {
      font-size: 1rem;
    }
  }
}
</style>
