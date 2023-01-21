<template>
  <component :is="currentTemplate" />
</template>

<script>
import { mapWritableState } from "pinia";
import { auth } from "@/includes/firebase";
import useUserStore from "@/stores/user";
import AppTemplate from "@/templates/AppTemplate.vue";
import SongTemplate from "@/templates/SongTemplate.vue";

export default {
  name: "App",
  components: {
    AppTemplate,
    SongTemplate,
  },
  async created() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.displayName = currentUser.displayName;
      this.photoURL = currentUser.photoURL;
      this.userLoggedIn = true;
      this.userId = currentUser.uid;
    }
  },
  computed: {
    currentTemplate() {
      return this.$route.meta.template;
    },
    ...mapWritableState(useUserStore, [
      "displayName",
      "photoURL",
      "userLoggedIn",
      "userId",
    ]),
  },
};
</script>
<style lang="scss">
// Override Eva icons pause-circle styles
svg {
  g[data-name="pause-circle"] {
    path:first-of-type {
      display: none;
    }

    path:not(:first-of-type) {
      scale: 1 1.5;
      transform: translateY(-4px);
    }
  }
}

.song-cover {
  background-size: cover;
}
</style>
