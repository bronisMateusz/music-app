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
            <button type="button" @click.prevent="toggleAuthModal">
              Login / Register
              <eva-icon name="person-outline" />
            </button>
          </li>
          <li v-else>
            <button type="button" @click.prevent="logout">
              Logout
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
