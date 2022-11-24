<template>
  <div id="notification" class="notice">
    <eva-icon name="alert-circle" height="48" width="48" />
    <div class="notification-details">
      <strong>Please wait</strong>
      <p>Your account is being created.</p>
    </div>
  </div>
</template>

<styles lang="scss">
@import "@/assets/scss/abstracts/variables";

#notification {
  align-items: flex-start;
  backdrop-filter: blur(15px);
  background-color: rgba($color: $color-element, $alpha: 0.5);
  border-radius: 50px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25);
  column-gap: 10px;
  display: flex;
  left: 50%;
  padding: 5px 24px 5px 5px;
  position: fixed;
  top: 15px;
  transform: translateX(-50%);

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
  }

  .notification-details {
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    row-gap: 2px;

    strong {
      font-size: 18px;
      font-weight: 700;
    }

    p {
      color: $text-primary;
    }
  }
}
</styles>
