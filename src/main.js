import { createApp } from "vue";
import { createPinia } from "pinia";
import * as evaIcons from "@stefandesu/eva-icons-vue";

import App from "./App.vue";
import router from "./router";
import VeeValidate from "./includes/validation";
import { auth } from "./includes/firebase";
import MusicMetadata from "./includes/music-metadata";

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(evaIcons);
    app.use(VeeValidate);
    app.use(MusicMetadata);

    app.mount("#app");
  }
});
