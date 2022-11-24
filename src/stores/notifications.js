import { defineStore } from "pinia";

export default defineStore("notifications", {
  state: () => ({
    showNotification: false,
    notificationType: "",
    notificationHeading: "",
    notificationMsg: "",
  }),

  actions: {
    autoHideNotification() {
      setTimeout(() => (this.showNotification = false), 5000);
    },
  },
});
