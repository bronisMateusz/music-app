<template>
  <component :is="currentTemplate" />
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
</style>
