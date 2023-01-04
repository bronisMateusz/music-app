<template>
  <header id="header">
    <!-- Page Name -->
    <h1>Home</h1>
    <!-- Searchbar -->
    <div id="searchbar">
      <label for="search">Search</label>
      <input id="search" type="text" placeholder="Search..." />
      <eva-icon name="search-outline" height="24" width="24" />
      <!-- Auth Button -->
      <auth-button />
    </div>
    <!-- Notification -->
    <notification />
  </header>
</template>

<script>
import AuthButton from "@/components/AuthButton.vue";
import Notification from "@/components/Notification.vue";

export default {
  components: { AuthButton, Notification },
};
</script>

<style lang="scss">
#header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  left: 0;
  padding: 24px 24px 12px 24px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;

  &::before {
    @include blurred-bg;
    content: "";
    inset: 0;
    position: absolute;
    z-index: -1;
  }

  #searchbar {
    position: relative;

    label {
      @include visually-hidden;
    }

    input {
      background-color: $color-canvas;
      border-radius: 50px;
      border-style: none;
      color: $text-primary;
      font-size: 16px;
      padding: 17px 17px 17px 52px;
      width: 100%;
    }

    > svg {
      position: absolute !important;
      left: 16px;
      top: 50% !important;
      transform: translateY(-50%);
    }

    .auth-btn-wrapper {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);

      .auth-btn {
        height: 40px;
        width: 40px;
      }

      svg {
        height: 22px;
        width: 22px;
      }
    }
  }

  @media (min-width: 992px) {
    align-items: center;
    background-color: $color-canvas;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 100px;
    padding: 24px;

    #searchbar {
      width: 100%;
      max-width: 600px;

      input {
        @include blurred-bg;
        border: 1px solid $color-border-primary;
      }

      .auth-btn-wrapper {
        display: none;
      }
    }
  }
}
</style>
