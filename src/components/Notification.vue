<template>
  <div
    v-show="showNotification !== false"
    id="notification"
    :class="notificationType"
  >
    <eva-icon
      v-if="notificationType === 'success'"
      name="checkmark-circle-2"
      height="48"
      width="48"
    />
    <eva-icon
      v-else-if="notificationType === 'error'"
      name="close-circle"
      height="48"
      width="48"
    />
    <eva-icon v-else name="alert-circle" height="48" width="48" />
    <div class="notification-details">
      <strong>{{ notificationHeading }}</strong>
      <p>{{ notificationMsg }}</p>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useNotificationsStore from "@/stores/notifications";

export default {
  computed: {
    ...mapWritableState(useNotificationsStore, [
      "showNotification",
      "notificationType",
      "notificationHeading",
      "notificationMsg",
    ]),
  },
};
</script>

<styles lang="scss">
#notification {
  align-items: flex-start;
  backdrop-filter: blur(15px);
  background-color: rgba($color: $color-element, $alpha: 0.5);
  border-radius: 30px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25);
  column-gap: 10px;
  display: flex;
  left: 50%;
  max-width: calc(100% - 48px);
  padding: 5px 24px 5px 5px;
  position: fixed;
  top: 15px;
  transform: translateX(-50%);
  width: 100%;

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

@media (min-width: 768px) {
  #notification {
    max-width: 400px;
  }
}
</styles>
