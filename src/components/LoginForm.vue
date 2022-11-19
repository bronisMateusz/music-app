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
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="on"
        />
        <eva-icon name="eye-outline" height="18" width="18" />
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
export default {
  props: ["tab"],
  data() {
    return {
      loginSchema: {
        email: "required|max:100|email",
        password: "required|min:8|max:100",
      },
    };
  },
  methods: {
    login(values) {
      console.log(values);
    },
    tabChange() {
      this.$emit("tab-change");
    },
  },
};
</script>
