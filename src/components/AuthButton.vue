<template>
  <div class="auth-btn-wrapper">
    <button
      class="auth-btn"
      :title="!userLoggedIn ? 'Login / Register' : 'User menu'"
      @click.prevent="!userLoggedIn ? toggleAuthModal() : toggleUserMenu()"
    >
      <eva-icon name="people-outline" height="28" width="28" />
    </button>
    <user-menu v-if="isUserMenuOpen" @closeMenu="isUserMenuOpen = false" />
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
import useUserStore from "@/stores/user";
import UserMenu from "@/components/UserMenu.vue";

export default {
  data() {
    return {
      isUserMenuOpen: false,
    };
  },
  components: { UserMenu },
  computed: {
    ...mapWritableState(useAuthModalStore, ["isOpen"]),
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
    toggleAuthModal() {
      this.isOpen = !this.isOpen;
    },

    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
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
    padding: 0;
    position: relative;
    width: 60px;

    &:hover {
      background-color: $color-canvas;
      color: $text-primary;
    }

    svg {
      pointer-events: none;
    }
  }
}
</style>
