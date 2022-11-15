<template>
  <div id="auth-modal" :class="hiddenClass">
    <header>
      <!-- Modal Close Button -->
      <button
        class="modal-close"
        value="cancel"
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
        <!-- Modal Close Button -->
      </div>
    </header>
    <!-- Login Form -->
    <form v-show="tab === 'login'">
      <!-- Email -->
      <div>
        <label>
          Email
          <input type="email" placeholder="Email" />
        </label>
      </div>
      <!-- Password -->
      <div>
        <label>
          Password
          <input type="password" placeholder="Password" autocomplete="on" />
          <eva-icon name="eye-outline" height="18" width="18" />
        </label>
      </div>
      <div class="form-group">
        <!-- Password remember -->
        <div>
          <label>
            <input type="checkbox" id="login-remember" name="login-remember" />
            Remember for 30 days
          </label>
        </div>
        <!-- Forgot password-->
        <a href="#" id="forgot-password">Forgot password</a>
      </div>
      <button type="submit">Log in</button>
      <div class="form-group">
        <p>Don't have an account?</p>
        <a href="#" @click.prevent="tab = 'register'">Sign up for free</a>
      </div>
    </form>
    <!-- Registration Form -->
    <vee-form v-show="tab === 'register'" :validation-schema="schema">
      <!-- Name -->
      <div>
        <label>
          Name
          <vee-field type="text" name="name" placeholder="Name" />
        </label>
        <ErrorMessage name="name" />
      </div>
      <!-- Email -->
      <div>
        <label>
          Email
          <vee-field type="email" name="email" placeholder="Email" />
        </label>
        <ErrorMessage name="email" />
      </div>
      <!-- Password -->
      <div>
        <label>
          Password
          <input type="password" placeholder="Password" autocomplete="on" />
          <eva-icon name="eye-outline" height="18" width="18" />
        </label>
      </div>
      <!-- Confirm password -->
      <div>
        <label>
          Confirm password
          <input
            type="password"
            placeholder="Confirm password"
            autocomplete="on"
          />
          <eva-icon name="eye-outline" height="18" width="18" />
        </label>
      </div>
      <!-- TOS -->
      <div class="form-group">
        <label>
          <input type="checkbox" id="accept-tos" name="accept-tos" />
          Accept terms of service
        </label>
      </div>
      <button type="submit">Create account</button>
      <div class="form-group">
        <p>Already have an account?</p>
        <a href="#" @click.prevent="tab = 'login'">Log in</a>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import useModalStore from "@/stores/modal";

export default {
  name: "Auth",
  data() {
    return {
      tab: "login",
      schema: {
        name: "required|min:3|max:100|alphaSpaces",
        email: "required|max:100|email",
        password: "",
        confirm_password: "",
        tos: "",
      },
    };
  },
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
    ...mapWritableState(useModalStore, ["isOpen"]),
  },
};
</script>
