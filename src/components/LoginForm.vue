<template>
  <vee-form :validation-schema="loginSchema" @submit="login">
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
        <vee-field
          v-if="!isPasswordVisible"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="on"
        />
        <vee-field
          v-else
          type="text"
          name="password"
          placeholder="Password"
          autocomplete="on"
        />
        <button
          v-if="!isPasswordVisible"
          tabindex="-1"
          title="Show password"
          @click.prevent="togglePasswordVisibility"
        >
          <eva-icon name="eye-outline" height="18" width="18" />
        </button>
        <button
          v-else
          tabindex="-1"
          title="Hide password"
          @click.prevent="togglePasswordVisibility"
        >
          <eva-icon name="eye-off-outline" height="18" width="18" />
        </button>
      </label>
      <ErrorMessage name="password" />
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
    <button type="submit" title="Log in">Log in</button>
    <div class="form-group">
      <p>Don't have an account?</p>
      <a href="#" @click.prevent="tabChange">Sign up for free</a>
    </div>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  props: ["tab"],
  data() {
    return {
      isPasswordVisible: false,
      loginSchema: {
        email: "required|max:100|email",
        password: "required|min:8|max:100",
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, { authUser: "login" }),
    async login(values) {
      this.$emit("close-modal");
      await this.authUser(values);
    },

    tabChange() {
      this.$emit("tab-change");
    },

    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>
