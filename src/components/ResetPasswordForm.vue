<template>
  <vee-form
    id="reset-password-form"
    :validation-schema="resetPasswordSchema"
    @submit="resetPassword"
  >
    <!-- Email -->
    <div>
      <label>
        Email
        <vee-field
          v-model="email"
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        />
      </label>
      <ErrorMessage name="email" />
    </div>
    <div class="form-group">
      <button @click.prevent="tabChange('login')">Back to login</button>
      <button type="submit" title="Reset password" @click.prevent="reset">
        Reset password
      </button>
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
      email: "",
      resetPasswordSchema: {
        email: "required|max:100|email",
      },
    };
  },
  props: ["tab"],
  methods: {
    ...mapActions(useUserStore, ["resetPassword"]),
    ...mapActions(useNotificationsStore, ["setNotification"]),
    tabChange(targetTab) {
      this.$emit("tab-change", targetTab);
    },
    async reset() {
      try {
        await this.resetPassword(this.email);
      } catch (error) {
        this.setNotification(
          "error",
          "Sorry",
          "We couldn't submit your request"
        );
        return;
      }

      this.$emit("close-modal");
      this.setNotification("success", "Success", "Reset password email sent");
      this.tabChange("login");
    },
  },
};
</script>

<style lang="scss">
#reset-password-form {
  .form-group button {
    width: 100%;
  }
}
</style>
