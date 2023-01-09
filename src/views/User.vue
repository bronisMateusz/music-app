<template>
  <div id="user-details">
    <div
      class="user-picture"
      @dragend.prevent.stop="is_dragover = false"
      @dragover.prevent.stop="is_dragover = true"
      @dragenter.prevent.stop="is_dragover = true"
      @dragleave.prevent.stop="is_dragover = false"
      @drop.prevent.stop="upload($event)"
    >
      <eva-icon
        v-if="!photoURL"
        name="people-outline"
        height="112"
        width="112"
      />
      <img v-else :src="photoURL" alt="user photo" />
      <label v-if="!is_dragover" for="file-input">browse</label>
      <label v-else for="file-input" class="dragover">
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
      </label>
      <input
        id="file-input"
        class="hidden"
        type="file"
        @change="upload($event)"
      />
    </div>
    <h2>{{ displayName }}</h2>
    <vee-form
      ref="userDetailsForm"
      :validation-schema="userSchema"
      :initial-values="user"
    >
      <!-- User name -->
      <div>
        <label>
          User name
          <vee-field
            v-model="user.displayName"
            type="text"
            name="displayName"
            placeholder="User name"
            @keyup="validate"
            validateOnInput="true"
          />
        </label>
        <ErrorMessage name="displayName" />
      </div>
      <!-- Theme -->
      <div>
        <label>
          Theme
          <select name="theme">
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import useNotificationsStore from "@/stores/notifications";

export default {
  beforeRouteEnter(to, from, next) {
    const userStore = useUserStore();
    if (userStore.userLoggedIn) {
      next();
    } else {
      next({ name: "home" });
    }
  },
  data() {
    return {
      is_dragover: false,
      user: {
        // Exists only because of validation.
        displayName: "",
      },
      userSchema: {
        displayName: "required|min:3|max:100|alphaSpaces",
      },
    };
  },
  async created() {
    this.user.displayName = this.displayName;
  },
  computed: {
    ...mapWritableState(useUserStore, ["displayName", "photoURL"]),
  },
  methods: {
    ...mapActions(useUserStore, ["updateProfile", "uploadPhoto"]),
    ...mapActions(useNotificationsStore, ["setNotification"]),

    validate() {
      // If validation pass update user store and details in Firebase.
      this.$refs.userDetailsForm.validate().then((result) => {
        if (result.valid) this.update();
      });
    },

    async update() {
      try {
        await this.updateProfile({
          displayName: this.user.displayName,
          photoURL: this.photoURL,
        });
      } catch (error) {
        this.setNotification(
          "error",
          "Something went wrong",
          "We couldn't update your profile"
        );
        return;
      }

      this.setNotification("success", "Success!", "Profile details updated");
    },

    async upload(event) {
      const file = event.dataTransfer
        ? [...event.dataTransfer.files][0]
        : [...event.target.files][0];

      if (file.type !== "image/jpeg") return;

      try {
        await this.uploadPhoto(file);
      } catch (error) {
        this.setNotification(
          "error",
          "Something went wrong",
          "We couldn't update your profile"
        );
        return;
      }

      this.setNotification("success", "Success!", "Profile details updated");
    },
  },
};
</script>

<style lang="scss">
#user-details {
  align-items: center;
  background: linear-gradient(
    180deg,
    $color-canvas 0%,
    rgba($text-primary, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -36px -24px -48px;
  padding: 48px 24px;
  position: relative;

  .user-picture {
    background-color: $text-primary;
    border-radius: 50%;
    color: $color-canvas;
    height: 242px;
    margin-bottom: 24px;
    padding: 0;
    position: relative;
    width: 242px;

    svg,
    label {
      left: 50%;
      position: absolute;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }

    img {
      @include user-photo;
    }

    label {
      border-radius: 50%;
      color: transparent;
      cursor: pointer;
      display: block;
      height: 242px;
      width: 242px;

      &.dragover {
        background-color: rgba($text-primary, 0.9);
        color: $text-primary-inverted;
      }
    }
  }

  form {
    column-gap: 24px;
    display: flex;
    flex-direction: column;
    margin-top: 96px;
    row-gap: 8px;
    width: 100%;

    div {
      @include form-element;
      @include form-element-error;
      width: 100%;
    }
  }

  @media (min-width: 992px) {
    margin: -1px -24px -48px;
    min-height: calc(100vh - 315px);

    form {
      flex-direction: row;
    }
  }
}
</style>
