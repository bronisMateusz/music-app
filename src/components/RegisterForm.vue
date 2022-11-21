<template>
  <vee-form
    v-if="!reg_in_submission"
    :validation-schema="registrationSchema"
    @submit="register"
  >
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
    <!-- Confirm password -->
    <div>
      <label>
        Confirm password
        <vee-field
          v-if="!isConfirmPasswordVisible"
          type="password"
          name="confirm_password"
          placeholder="Confirm password"
          autocomplete="on"
        />
        <vee-field
          v-else
          type="text"
          name="confirm_password"
          placeholder="Confirm password"
          autocomplete="on"
        />
        <button
          type="button"
          class="btn"
          @click.prevent="isConfirmPasswordVisible = !isConfirmPasswordVisible"
        >
          <eva-icon
            v-if="!isConfirmPasswordVisible"
            name="eye-outline"
            height="18"
            width="18"
          />
          <eva-icon v-else name="eye-off-outline" height="18" width="18" />
        </button>
      </label>
      <ErrorMessage name="confirm_password" />
    </div>
    <!-- TOS -->
    <div class="form-group">
      <label>
        <vee-field type="checkbox" name="tos" value="1" />
        Accept terms of service
      </label>
      <ErrorMessage name="tos" />
    </div>
    <button type="submit">Create account</button>
    <div class="form-group">
      <p>Already have an account?</p>
      <a href="#" @click.prevent="tabChange">Log in</a>
    </div>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  data() {
    return {
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      registrationSchema: {
        name: "required|min:3|max:100|alphaSpaces",
        email: "required|max:100|email",
        password: "required|min:8|max:100",
        confirm_password: "passwordMismatch:@password",
        tos: "tos",
      },
      reg_in_submission: false,
      reg_alert_variant: "",
      reg_alert_heading: "Notice",
      reg_alert_msg: "Your account is being created",
    };
  },
  props: ["tab", "reg_show_alert"],
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),

    async register(values) {
      this.reg_in_submission = true;
      this.$emit("show-alert");

      try {
        await this.createUser(values);
      } catch (error) {
        this.$emit("register-status", {
          reg_alert_variant: "error",
          reg_alert_heading: "Error",
          reg_alert_msg: "An unexpected error occurred. Please try again later",
        });
        return;
      }

      this.$emit("register-status", {
        reg_alert_variant: "success",
        reg_alert_heading: "Success",
        reg_alert_msg: "Your account has been created",
      });
    },

    tabChange() {
      this.$emit("tab-change");
    },
  },
};
</script>
