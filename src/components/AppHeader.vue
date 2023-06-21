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
    <app-notification />
  </header>
</template>

<script>
import AuthButton from '@/components/AuthButton.vue'
import AppNotification from '@/components/AppNotification.vue'

export default {
  components: { AuthButton, AppNotification }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#header {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
  padding: 24px 24px 12px 24px;

  &::before {
    @include blurred-bg($color-element);
    position: absolute;
    z-index: -1;
    inset: 0;
    content: '';
  }

  #searchbar {
    position: relative;

    label {
      @include visually-hidden;
    }

    input {
      @include blurred-bg($color-element);
      border: 1px solid $color-border-primary;
      border-radius: 50px;
      padding: 17px 17px 17px 52px;
      width: 100%;
      color: $text-primary;
      font-size: 16px;
    }

    > svg {
      position: absolute !important;
      top: 50% !important;
      left: 16px;
      transform: translateY(-50%);
    }

    .auth-btn-wrapper {
      position: absolute;
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
      height: 40px;

      .auth-btn {
        width: 40px;
        height: 40px;
      }

      svg {
        width: 22px;
        height: 22px;
      }
    }
  }

  @media (min-width: $lg) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 100px;
    padding: 24px;

    &::before {
      @include blurred-bg($color-canvas);
    }

    #searchbar {
      width: 100%;
      max-width: 600px;

      .auth-btn-wrapper {
        display: none;
      }
    }
  }
}
</style>
