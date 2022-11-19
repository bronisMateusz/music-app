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
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="on"
        />
        <eva-icon name="eye-outline" height="18" width="18" />
      </label>
      <ErrorMessage name="password" />
    </div>
    <!-- Confirm password -->
    <div>
      <label>
        Confirm password
        <vee-field
          type="password"
          name="confirm_password"
          placeholder="Confirm password"
          autocomplete="on"
        />
        <eva-icon name="eye-outline" height="18" width="18" />
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
export default {
  data() {
    return {
      registrationSchema: {
        name: "required|min:3|max:100|alphaSpaces",
        email: "required|max:100|email",
        password: "required|min:8|max:100",
        confirm_password: "passwordMismatch:@password",
        tos: "tos",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "",
      reg_alert_heading: "Please wait",
      reg_alert_msg: "Your account is being created",
    };
  },
  props: ["tab"],
  methods: {
    register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "";
      this.reg_alert_heading = "Please wait";
      this.reg_alert_msg = "Your account is being created";

      this.reg_alert_heading = "Success";
      this.reg_alert_msg = "Your account has been created";
      console.log(values);
    },
    tabChange() {
      this.$emit("tab-change");
    },
  },
};
</script>
