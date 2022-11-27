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
          type="button"
          class="btn"
          tabindex="-1"
          @click.prevent="isPasswordVisible = !isPasswordVisible"
        >
          <eva-icon
            v-if="!isPasswordVisible"
            name="eye-outline"
            height="18"
            width="18"
          />
          <eva-icon v-else name="eye-off-outline" height="18" width="18" />
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
    <button type="submit">Log in</button>
    <div class="form-group">
      <p>Don't have an account?</p>
      <a href="#" @click.prevent="tabChange">Sign up for free</a>
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

    tabChange() {
      this.$emit("tab-change");
    },
  },
};
</script>
