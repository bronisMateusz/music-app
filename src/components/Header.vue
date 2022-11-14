<template>
  <header id="header">
    <nav>
      <!-- Page Name -->
      <h1>Home</h1>

      <div>
        <!-- Primary Navigation -->
        <ul>
          <!-- Navigation Links -->
          <li>
            <a href="#" @click.prevent="toggleAuthModal">
              Login / Register
              <eva-icon name="person-outline" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore),
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen);
    },
  },
};
</script>
