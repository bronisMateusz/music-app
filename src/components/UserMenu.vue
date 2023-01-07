<template>
  <div id="user-menu" ref="userMenu">
    <ul>
      <li>
        <router-link
          :to="{ name: 'user', params: { id: userId } }"
          @click.prevent="closeMenu"
        >
          Settings
        </router-link>
      </li>
      <li>
        <button title="Logout" @click.prevent="logout(), closeMenu()">
          Logout
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import useUserStore from "@/stores/user";

export default {
  mounted() {
    document.addEventListener("mousedown", this.onClickOutside);
  },
  unmounted() {
    document.removeEventListener("mousedown", this.onClickOutside);
  },
  computed: {
    ...mapState(useUserStore, ["userId"]),
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),

    closeMenu() {
      this.$emit("closeMenu");
    },

    onClickOutside(event) {
      const target = event.target;
      const userMenu = this.$refs.userMenu;

      if (
        !userMenu.contains(target) &&
        target !== userMenu.parentElement.firstElementChild
      )
        this.closeMenu();
    },
  },
};
</script>

<style lang="scss">
#user-menu {
  position: absolute;
  right: 0;
  top: calc(100%);

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

  @media (min-width: 992px) {
    left: 0;
    right: unset;
    top: calc(100% + 12px);

    ul {
      text-align: left;

      a,
      button {
        padding-left: 24px;
        padding-right: 48px;
      }
    }
  }
}
</style>
