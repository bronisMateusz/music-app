<template>
  <div id="notification-wrapper">
    <div
      v-if="!!showNotification"
      class="notification"
      :class="notificationType"
    >
      <eva-icon
        v-if="notificationType === 'success' && !showCloseButton"
        name="checkmark-circle-2"
        height="48"
        width="48"
        @mouseover="showCloseButton = true"
      />
      <eva-icon
        v-else-if="notificationType === 'error' && !showCloseButton"
        name="close-circle"
        height="48"
        width="48"
        @mouseover="showCloseButton = true"
      />
      <eva-icon
        v-else-if="notificationType === 'notice' && !showCloseButton"
        name="alert-circle"
        height="48"
        width="48"
        @mouseover="showCloseButton = true"
      />
      <button
        v-else
        class="close-btn"
        title="Close"
        @mouseleave="showCloseButton = false"
        @click.prevent="hideNotification"
      >
        <eva-icon name="close-circle" height="48" width="48" />
      </button>
      <div class="notification-details">
        <strong>{{ notificationHeading }}</strong>
        <p>{{ notificationMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";

export default {
  data() {
    return {
      showCloseButton: false,
    };
  },
  computed: {
    ...mapWritableState(useNotificationsStore, [
      "showNotification",
      "notificationType",
      "notificationHeading",
      "notificationMsg",
      "timer",
    ]),
  },
  methods: {
    ...mapActions(useNotificationsStore, ["autoHideNotification"]),
    hideNotification() {
      this.showNotification = false;
      this.showCloseButton = false;
    },
  },
  beforeUpdate() {
    clearTimeout(this.timer);
  },
  updated() {
    this.autoHideNotification();
  },
};
</script>

<styles lang="scss">
#notification-wrapper {
  border-radius: 30px;
  display: flex;
  justify-content: center;
  left: 24px;
  margin: 0 auto;
  max-width: 400px;
  position: fixed;
  right: 24px;
  top: 15px;
  z-index: 2;
  transition: all 1s ease-in-out;

  .notification {
    align-items: flex-start;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    background-color: rgba($color: $color-element, $alpha: 0.5);
    border-radius: 30px;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25);
    column-gap: 10px;
    display: flex;
    max-width: 400px;
    padding: 5px 24px 5px 5px;

    &.notice {
      color: $text-notice;
    }

    &.success {
      color: $text-success;
    }

    &.error {
      color: $text-error;
    }

    svg {
      min-width: 48px;
      top: 0 !important;
    }

    .close-btn {
      height: 48px;
      padding: 0;
    }

    .notification-details {
      display: flex;
      flex-direction: column;
      margin: 3.5px 0;
      row-gap: 2px;

      strong {
        font-size: 18px;
        font-weight: 700;
      }

      p {
        color: $text-primary;
        line-height: 1.25rem;
      }
    }
  }
}
</styles>
