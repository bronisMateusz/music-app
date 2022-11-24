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
    setNotification(type, heading, msg) {
      this.showNotification = true;
      this.notificationType = type;
      this.notificationHeading = heading;
      this.notificationMsg = msg;
    },

    autoHideNotification() {
      this.timer = setTimeout(() => (this.showNotification = false), 5000);
    },
  },
});
