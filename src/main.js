import { createApp } from "vue";
import { createPinia } from "pinia";
import * as evaIcons from "@stefandesu/eva-icons-vue";

import App from "./App.vue";
import router from "./router";
import { auth } from "./includes/firebase";
import VeeValidate from "./includes/validation";
import i8n from "./includes/i8n";

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(evaIcons);
    app.use(VeeValidate);
    app.use(i8n);

    app.mount("#app");
  }
});
