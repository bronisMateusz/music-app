import { defineStore } from "pinia";

export default defineStore("notifications", {
  state: () => ({
    showNotification: false,
    notificationType: "",
    notificationHeading: "",
    notificationMsg: "",
  }),
});
