<template>
  <div id="notification-wrapper">
    <div v-if="!!showNotification" class="notification" :class="notificationType">
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
import { mapWritableState, mapActions } from 'pinia'
import useNotificationsStore from '@/stores/notifications'

export default {
  data() {
    return {
      showCloseButton: false
    }
  },
  computed: {
    ...mapWritableState(useNotificationsStore, [
      'showNotification',
      'notificationType',
      'notificationHeading',
      'notificationMsg',
      'timer'
    ])
  },
  methods: {
    ...mapActions(useNotificationsStore, ['autoHideNotification']),
    hideNotification() {
      this.showNotification = false
      this.showCloseButton = false
    }
  },
  beforeUpdate() {
    clearTimeout(this.timer)
  },
  updated() {
    this.autoHideNotification()
  }
}
</script>

<styles lang="scss">
@use '@/assets/scss/variables.scss' as *;

#notification-wrapper {
  display: flex;
  position: fixed;
  top: 15px;
  right: 24px;
  left: 24px;
  justify-content: center;
  z-index: 2;
  transition: all 1s ease-in-out;
  margin: 0 auto;
  border-radius: 30px;
  max-width: 400px;

  .notification {
    display: flex;
    column-gap: 10px;
    align-items: flex-start;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    background-color: rgba($color: $color-element, $alpha: 0.5);
    padding: 5px 24px 5px 5px;
    max-width: 400px;

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
      top: 0 !important;
      min-width: 48px;
    }

    .close-btn {
      padding: 0;
      height: 48px;
    }

    .notification-details {
      display: flex;
      row-gap: 2px;
      flex-direction: column;
      margin: 3.5px 0;

      strong {
        font-weight: 700;
        font-size: 18px;
      }

      p {
        color: $text-primary;
        line-height: 1.25rem;
      }
    }
  }
}
</styles>
