<template>
  <div class="auth-btn-wrapper">
    <button
      class="auth-btn"
      v-if="!userLoggedIn"
      title="Login / Register"
      @click.prevent="toggleAuthModal"
    >
      <eva-icon name="people-outline" height="28" width="28" />
    </button>
    <button v-else class="auth-btn">
      <eva-icon name="people-outline" height="28" width="28" />
    </button>
    <div class="auth-dropdown">
      <ul>
        <li>
          <router-link :to="{ name: 'user', params: { id: '1' } }">
            Settings
          </router-link>
        </li>
        <li>
          <button title="Logout" @click.prevent="logout">Logout</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
import useUserStore from "@/stores/user";

export default {
  computed: {
    ...mapWritableState(useAuthModalStore, ["isOpen"]),
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),
    toggleAuthModal() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss">
.auth-btn-wrapper {
  position: relative;

  .auth-btn {
    background-color: $text-primary;
    border-radius: 50px;
    color: $color-canvas;
    height: 60px;
    height: 60px;
    padding: 0;
    position: relative;
    width: 60px;

    &:hover {
      background-color: $color-canvas;
      color: $text-primary;
    }
  }

  .auth-dropdown {
    position: absolute;
    right: 0;
    top: calc(100%);

    &::after {
      @include blurred-bg;
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

        &:not(:hover) {
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
}
</style>
