<template>
  <div id="auth-modal" v-if="isOpen">
    <header>
      <!-- Modal close button -->
      <button
        class="close-btn"
        value="cancel"
        title="Close"
        @click.prevent=";(isOpen = false), (tab = 'login')"
      >
        <eva-icon name="close-outline" height="28" width="28" />
      </button>
      <div v-if="tab === 'login'">
        <!--Title-->
        <h2 class="title">Welcome back</h2>
        <!--Subtitle-->
        <p class="subtitle">Enter your account details</p>
      </div>
      <div v-if="tab === 'register'">
        <!--Title-->
        <h2 class="title">Create an account</h2>
        <!--Subtitle-->
        <p class="subtitle">Enter the fields below to get started for free.</p>
      </div>
    </header>
    <!-- Login form -->
    <login-form
      v-if="tab === 'login'"
      :tab="tab"
      @tab-change="tab = $event"
      @close-modal="isOpen = false"
    />
    <!-- Registration form -->
    <register-form
      v-if="tab === 'register'"
      :tab="tab"
      @tab-change="tab = $event"
      @close-modal="isOpen = false"
    />
    <!-- Reset password form -->
    <reset-password-form
      v-if="tab === 'reset'"
      :tab="tab"
      @tab-change="tab = $event"
      @close-modal="isOpen = false"
    />
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import useAuthModalStore from '@/stores/auth-modal'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ResetPasswordForm from '@/components/ResetPasswordForm.vue'

export default {
  components: {
    LoginForm,
    RegisterForm,
    ResetPasswordForm
  },
  data() {
    return {
      tab: 'login'
    }
  },
  computed: {
    ...mapWritableState(useAuthModalStore, ['isOpen'])
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#auth-modal {
  display: grid;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 20px 20px 0 0;
  background-color: $color-element;
  height: calc(100% - 96px);
  max-height: 570px;
  overflow: hidden;

  header {
    display: flex;
    position: sticky;
    top: 0;
    flex-direction: column;
    z-index: 1;
    border-radius: 20px 20px 0 0;
    background-color: $color-element;
    padding: 24px 24px 0;

    .close-btn {
      align-self: flex-end;
      margin: -7px -7px 0 0;
      padding: 0;
    }

    .title {
      margin-bottom: 8px;
    }

    .subtitle {
      margin-bottom: 48px;
      color: $text-secondary;
    }
  }

  form {
    @include scrollbar-styles($color-element);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 24px 48px;
    overflow-y: auto;

    > div {
      @include form-element;

      &:not(.form-group) {
        label {
          color: transparent;

          &:focus-within {
            color: $text-secondary;
          }
        }
      }

      &.form-group {
        display: flex;
        column-gap: 8px;
        margin-top: 12px;

        &:last-of-type {
          justify-content: center;

          p {
            color: $text-secondary;
          }
        }

        label {
          display: flex;
          color: $text-primary;

          input {
            margin-right: 12px;
            width: 16px;
            height: 16px;
          }
        }

        #forgot-password {
          margin-left: auto;

          &:not(:hover) {
            color: $text-secondary;
          }
        }
      }

      @include form-element-error;
    }

    button[type='submit'] {
      cursor: pointer;
      margin: 24px 0 12px;
      border-style: none;
      border-radius: 50px;
      background-color: $color-canvas;
      padding: 16px;
      width: 100%;
      color: $text-primary;
      font-weight: 700;
      text-align: center;

      &:hover {
        background-color: darken($color-canvas, 5%);
      }
    }
  }

  @media (min-width: $lg) {
    position: fixed;
    right: unset;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    border-radius: 20px;
    min-width: 600px;

    header {
      top: unset;
      bottom: 0;
      border-radius: 20px;
      padding: 48px 48px 0;
    }

    form {
      padding: 0 48px 48px;
      max-height: 408.5px;
    }
  }
}
</style>
