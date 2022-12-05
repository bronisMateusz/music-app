<template>
  <button
    class="auth-btn"
    v-if="!userLoggedIn"
    title="Login / Register"
    @click.prevent="toggleAuthModal"
  >
    <eva-icon name="people-outline" height="28" width="28" />
  </button>
  <button v-else class="auth-btn" title="Logout" @click.prevent="logout">
    <eva-icon name="people-outline" height="28" width="28" />
  </button>
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
.auth-btn {
  background-color: $text-primary;
  border-radius: 50px;
  color: $color-canvas;
  height: 60px;
  padding: 0;
  width: 60px;

  &:hover {
    background-color: $color-canvas;
    color: $text-primary;
  }
}
</style>
