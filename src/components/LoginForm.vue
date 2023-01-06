<template>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div>
      <label>
        Email
        <vee-field
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        />
      </label>
      <ErrorMessage name="email" />
    </div>
    <!-- Password -->
    <div>
      <label>
        Password
        <vee-field
          :type="!isPasswordVisible ? 'password' : 'text'"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          @keydown.enter.prevent
        />
        <button
          tabindex="-1"
          :title="!isPasswordVisible ? 'Show password' : 'Hide password'"
          @click.prevent="togglePasswordVisibility"
        >
          <eva-icon
            :name="!isPasswordVisible ? 'eye-outline' : 'eye-off-outline'"
            height="18"
            width="18"
          />
        </button>
      </label>
      <ErrorMessage name="password" />
    </div>
    <div class="form-group">
      <!-- Password remember -->
      <div>
        <label>
          <vee-field type="checkbox" name="remember" checkboxValue="true" />
          Remember me
        </label>
      </div>
      <!-- Forgot password-->
      <a href="#" id="forgot-password" @click.prevent="tabChange('reset')"
        >Forgot password</a
      >
    </div>
    <button type="submit" title="Log in">Log in</button>
    <div class="form-group">
      <p>Don't have an account?</p>
      <a href="#" @click.prevent="tabChange('register')">Sign up for free</a>
    </div>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";
import useNotificationsStore from "@/stores/notifications";

export default {
  data() {
    return {
      isPasswordVisible: false,
      loginSchema: {
        email: "required|max:100|email",
        password: "required|min:8|max:100",
      },
    };
  },
  props: ["tab"],
  methods: {
    ...mapActions(useUserStore, { authUser: "login" }),
    ...mapActions(useNotificationsStore, ["setNotification"]),
    async login(values) {
      try {
        await this.authUser(values);
      } catch (error) {
        this.setNotification("error", "Sorry", "We couldn't log you in");
        return;
      }

      this.$emit("close-modal");
      this.setNotification("success", "Success", "You are logged in");
    },

    tabChange(targetTab) {
      this.$emit("tab-change", targetTab);
    },

    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>
