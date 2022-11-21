<template>
  <div id="auth-modal" :class="hiddenClass">
    <header>
      <!-- Modal Close Button -->
      <button
        class="btn"
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
        <div v-if="!reg_show_alert">
          <!--Title-->
          <h2 class="title">Create an account</h2>
          <!--Subtitle-->
          <p class="subtitle">
            Enter the fields below to get started for free.
          </p>
        </div>
        <div v-else :class="reg_alert_variant">
          <!--Title-->
          <h2 class="title">{{ reg_alert_heading }}</h2>
          <!--Subtitle-->
          <p class="subtitle">
            {{ reg_alert_msg }}
          </p>
        </div>
      </div>
    </header>
    <!-- Login Form -->
    <login-form
      v-if="tab === 'login'"
      :tab="tab"
      @tab-change="tab = 'register'"
    />
    <!-- Registration Form -->
    <register-form
      v-else
      :tab="tab"
      :reg_show_alert="reg_show_alert"
      @tab-change="tab = 'login'"
      @show-alert="reg_show_alert = true"
      @register-status="showRegisterStatus"
    />
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import useModalStore from "@/stores/modal";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "Auth",
  components: {
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      tab: "login",
      reg_show_alert: false,
      reg_alert_variant: "notice",
      reg_alert_heading: "Notice",
      reg_alert_msg: "Your account is being created",
    };
  },
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
    ...mapWritableState(useModalStore, ["isOpen"]),
  },
  methods: {
    showRegisterStatus({
      reg_alert_variant,
      reg_alert_heading,
      reg_alert_msg,
    }) {
      this.reg_alert_variant = reg_alert_variant;
      this.reg_alert_heading = reg_alert_heading;
      this.reg_alert_msg = reg_alert_msg;
    },
  },
};
</script>
