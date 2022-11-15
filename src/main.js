import { createApp } from "vue";
import { createPinia } from "pinia";
import * as evaIcons from "@stefandesu/eva-icons-vue";

import App from "./App.vue";
import router from "./router";
import VeeValidate from "./includes/validation";

import "./assets/scss/styles.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(evaIcons);
app.use(VeeValidate);

app.mount("#app");
