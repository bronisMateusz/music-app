<template>
  <component :is="currentTemplate">
    <app-template />
  </component>
</template>

<script>
import AppTemplate from "@/templates/AppTemplate.vue";
import SongTemplate from "@/templates/SongTemplate.vue";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";
import { mapWritableState } from "pinia";

export default {
  name: "App",
  components: {
    AppTemplate,
    SongTemplate,
  },
  computed: {
    currentTemplate() {
      return this.$route.meta.template;
    },
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) this.userLoggedIn = true;
  },
};
</script>
