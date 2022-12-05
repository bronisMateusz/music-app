<template>
  <header id="header">
    <nav>
      <!-- Page Name -->
      <h1>Home</h1>

      <div>
        <!-- Primary Navigation -->
        <ul>
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <button title="Login / Register" @click.prevent="toggleAuthModal">
              <eva-icon name="person-outline" />
            </button>
          </li>
          <li v-else>
            <button title="Logout" @click.prevent="logout">
              <eva-icon name="person-outline" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <notification />
  </header>
</template>

<script>
import Notification from "@/components/Notification.vue";
import { mapActions, mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  components: { Notification },
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
#header {
  background-color: $color-element;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;

  nav {
    display: flex;
  }

  @media (min-width: 992px) {
    background-color: $color-canvas;
    margin-left: 100px;
  }
}
</style>
