<template>
  <div id="auth-modal" v-if="!!isOpen">
    <header>
      <!-- Modal Close Button -->
      <button
        class="close-btn"
        value="cancel"
        title="Close"
        @click.prevent="isOpen = false"
      >
        <eva-icon name="close-outline" height="28" width="28" />
      </button>
      <div v-show="tab === 'login'">
        <!--Title-->
        <h2 class="title">Welcome back</h2>
        <!--Subtitle-->
        <p class="subtitle">Enter your account details</p>
      </div>
      <div v-show="tab === 'register'">
        <!--Title-->
        <h2 class="title">Create an account</h2>
        <!--Subtitle-->
        <p class="subtitle">Enter the fields below to get started for free.</p>
      </div>
    </header>
    <!-- Login Form -->
    <login-form
      v-if="tab === 'login'"
      :tab="tab"
      @tab-change="tab = 'register'"
      @close-modal="isOpen = false"
    />
    <!-- Registration Form -->
    <register-form
      v-else
      :tab="tab"
      :reg_show_alert="reg_show_alert"
      @tab-change="tab = 'login'"
      @close-modal="isOpen = false"
    />
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  components: {
    LoginForm,
    RegisterForm,
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
  position: absolute;
  right: 0;

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
    column-gap: 8px;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    max-height: calc(100vh - 246.5px);
    overflow-y: auto;
    padding: 0 24px 48px;

    @include scrollbar-styles($color-element);

    > div {
      position: relative;
      width: 100%;

      &:not(.form-group) {
        label {
          font-size: 0.875rem;
          color: transparent;
          position: relative;

          &:focus-within {
            color: $text-secondary;
          }

          input {
            background-color: transparent;
            border-color: $text-secondary;
            border-width: 0 0 1px 0;
            color: $text-primary;
            font-size: 1rem;
            margin-bottom: 34px;
            padding: 12px 0;
            color-scheme: dark;

            &:not(#login-remember) {
              width: 100%;

              &:focus {
                border-color: $text-primary;
                outline: 0;

                &::placeholder {
                  opacity: 0;
                }
              }

              &:hover {
                border-color: $text-primary;

                &::placeholder {
                  color: $text-primary;
                }
              }

              &::placeholder {
                color: $text-secondary;
                font-family: "Josefin Sans", sans-serif;
                font-weight: 500;
              }
            }
          }

          button {
            position: absolute !important;
            right: 0;
            top: 1.5rem !important;
          }
        }

        span[role="alert"] {
          position: absolute;

          &::first-letter {
            text-transform: uppercase;
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

      span[role="alert"] {
        bottom: 12px;
        color: $text-error;
        left: 0;
      }
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
      margin: 48px 0 12px;

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
      max-height: 398.5px;
    }
  }
}
</style>
