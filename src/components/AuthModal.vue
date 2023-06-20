<template>
  <div id="auth-modal" v-if="isOpen">
    <header>
      <!-- Modal close button -->
      <button
        class="close-btn"
        value="cancel"
        title="Close"
        @click.prevent="
          isOpen = false;
          tab = 'login';
        "
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
import { mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import ResetPasswordForm from "@/components/ResetPasswordForm.vue";

export default {
  components: {
    LoginForm,
    RegisterForm,
    ResetPasswordForm,
  },
  data() {
    return {
      tab: "login",
    };
  },
  computed: {
    ...mapWritableState(useAuthModalStore, ["isOpen"]),
  },
};
</script>

<style lang="scss">
#auth-modal {
  background-color: $color-element;
  border-radius: 20px 20px 0 0;
  bottom: 0;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  left: 0;
  max-height: calc(100% - 96px);
  overflow: hidden;
  position: fixed;
  right: 0;
  z-index: 2;

  header {
    background-color: $color-element;
    border-radius: 20px 20px 0 0;
    display: flex;
    flex-direction: column;
    padding: 24px 24px 0;
    position: sticky;
    top: 0;
    z-index: 1;

    .close-btn {
      align-self: flex-end;
      margin: -7px -7px 0 0;
      padding: 0;
    }

    .title {
      margin-bottom: 8px;
    }

    .subtitle {
      color: $text-secondary;
      margin-bottom: 48px;
    }
  }

  form {
    @include scrollbar-styles($color-element);
    overflow-y: auto;
    padding: 0 24px 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;

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
        column-gap: 8px;
        display: flex;
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
            height: 16px;
            width: 16px;
            margin-right: 12px;
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

    button[type="submit"] {
      background-color: $color-canvas;
      border-style: none;
      border-radius: 50px;
      color: $text-primary;
      cursor: pointer;
      font-weight: 700;
      padding: 16px;
      text-align: center;
      width: 100%;
      margin: 24px 0 12px;

      &:hover {
        background-color: darken($color-canvas, 5%);
      }
    }
  }

  @media (min-width: 992px) {
    bottom: 50%;
    border-radius: 20px;
    left: 50%;
    min-width: 600px;
    position: fixed;
    right: unset;
    transform: translate(-50%, 50%);

    header {
      top: unset;
      border-radius: 20px;
      bottom: 0;
      padding: 48px 48px 0;
    }

    form {
      padding: 0 48px 48px;
      max-height: 408.5px;
    }
  }
}
</style>
