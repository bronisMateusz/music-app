<template>
  <header id="header">
    <nav>
      <!-- Page Name -->
      <h1>Home</h1>

      <div>
        <!-- Primary Navigation -->
        <ul>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <button type="button" @click.prevent="toggleAuthModal">
              Login / Register
              <eva-icon name="person-outline" />
            </button>
          </li>
          <li v-else>
            <button type="button" @click.prevent="userStore.logout">
              Logout
              <eva-icon name="person-outline" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore, useUserStore),
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
  },
};
</script>
