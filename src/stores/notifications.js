import { defineStore } from "pinia";

export default defineStore("notifications", {
  state: () => ({
    showNotification: false,
    notificationType: "",
    notificationHeading: "",
    notificationMsg: "",
    timer: null,
  }),

  actions: {
    autoHideNotification() {
      this.timer = setTimeout(() => (this.showNotification = false), 5000);
    },
  },
});
