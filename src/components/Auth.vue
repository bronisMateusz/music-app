<template>
  <div id="auth-modal" v-if="!!isOpen">
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
        <!--Title-->
        <h2 class="title">Create an account</h2>
        <!--Subtitle-->
        <p class="subtitle">Enter the fields below to get started for free.</p>
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
    />
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useAuthModalStore from "@/stores/auth-modal";
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
    };
  },
  computed: {
    ...mapWritableState(useAuthModalStore, ["isOpen"]),
  },
};
</script>
