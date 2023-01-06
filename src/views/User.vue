<template>
  <div id="user-details">
    <div class="user-picture">
      <eva-icon name="people-outline" height="112" width="112" />
    </div>
    <h2>{{ displayName }}</h2>
    <vee-form
      :validation-schema="userSchema"
      :initial-values="user"
      @submit="update"
    >
      <!-- User name -->
      <div>
        <label>
          User name
          <vee-field type="text" name="displayName" placeholder="User name" />
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
      <button type="submit" title="Log in">Log in</button>
    </vee-form>
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import { doc, getDoc } from "firebase/firestore";
import { mapWritableState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import useNotificationsStore from "@/stores/notifications";

export default {
  data() {
    return {
      user: {
        displayName: "",
      },
      userSchema: {
        displayName: "required|min:3|max:100|alphaSpaces",
      },
    };
  },
  async created() {
    const userRef = doc(db, "users", this.$route.params.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      this.$router.push({ name: "home" });
      return;
    }
    this.user.displayName = this.displayName;
  },
  computed: {
    ...mapWritableState(useUserStore, ["displayName", "userId"]),
  },
  methods: {
    ...mapActions(useUserStore, ["updateProfile"]),
    ...mapActions(useNotificationsStore, ["setNotification"]),

    async update(values) {
      this.user.displayName = values.displayName;

      try {
        await this.updateProfile(this.user);
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
    rgba($text-primary, 0.5) 0%,
    $color-canvas 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  position: relative;
  margin: -36px -24px auto;

  .user-picture {
    background-color: $text-primary;
    border-radius: 50%;
    color: $color-canvas;
    height: 242px;
    margin-bottom: 24px;
    padding: 0;
    position: relative;
    width: 242px;

    svg {
      position: absolute;
      left: 50%;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }
  }

  form {
    column-gap: 24px;
    display: flex;
    flex-direction: column;
    margin-top: 48px;
    row-gap: 8px;
    width: 100%;

    div {
      @include form-element;
      @include form-element-error;
    }
  }

  @media (min-width: 992px) {
    margin-top: -7px;
    padding: 48px 24px;

    form {
      flex-direction: row;
    }
  }
}
</style>
