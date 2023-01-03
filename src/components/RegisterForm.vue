<template>
  <vee-form :validation-schema="registrationSchema" @submit="register">
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
          :type="!isPasswordVisible ? 'password' : 'textfield'"
          name="password"
          placeholder="Password"
          autocomplete="new-password"
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
    <!-- Confirm password -->
    <div>
      <label>
        Confirm password
        <vee-field
          :type="!isConfirmPasswordVisible ? 'password' : 'textfield'"
          name="confirm_password"
          placeholder="Confirm password"
          autocomplete="on"
        />
        <button
          tabindex="-1"
          :title="!isConfirmPasswordVisible ? 'Show password' : 'Hide password'"
          @click.prevent="togglePasswordVisibility"
        >
          <eva-icon
            :name="
              !isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'
            "
            height="18"
            width="18"
          />
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
    <button type="submit" title="Create account">Create account</button>
    <div class="form-group">
      <p>Already have an account?</p>
      <a href="#" @click.prevent="tabChange('login')">Log in</a>
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
      isConfirmPasswordVisible: false,
      registrationSchema: {
        name: "required|min:3|max:100|alphaSpaces",
        email: "required|max:100|email",
        password: "required|min:8|max:100",
        confirm_password: "passwordMismatch:@password",
        tos: "tos",
      },
    };
  },
  props: ["tab"],
  methods: {
    ...mapActions(useUserStore, { createUser: "register" }),
    ...mapActions(useNotificationsStore, ["setNotification"]),

    async register(values) {
      this.setNotification(
        "notice",
        "Please wait",
        "We're creating your account"
      );

      try {
        await this.createUser(values);
      } catch (error) {
        this.setNotification(
          "error",
          "Sorry",
          "We could't create your account"
        );
        return;
      }

      this.$emit("close-modal");
      this.setNotification("success", "Success", "Your account is ready!");
    },

    tabChange(targetTab) {
      this.$emit("tab-change", targetTab);
    },
  },
};
</script>
