<template>
  <div id="user-details">
    <div
      class="user-picture"
      @dragend.prevent.stop="isDragover = false"
      @dragover.prevent.stop="isDragover = true"
      @dragenter.prevent.stop="isDragover = true"
      @dragleave.prevent.stop="isDragover = false"
      @drop.prevent.stop="updatePicture($event)"
    >
      <eva-icon v-if="!photoURL" name="people-outline" height="112" width="112" />
      <img v-else :src="photoURL" alt="user photo" />
      <label v-if="!isDragover" for="file-input">browse</label>
      <label v-else for="file-input" class="dragover">
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
      </label>
      <input id="file-input" type="file" @change="updatePicture($event)" />
    </div>
    <h2>{{ displayName }}</h2>
    <vee-form ref="userDetailsForm" :validation-schema="userSchema" :initial-values="user">
      <!-- User name -->
      <div>
        <label>
          User name
          <vee-field
            v-model="displayName"
            type="text"
            name="displayName"
            placeholder="User name"
            @keyup="validate"
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
import { mapWritableState, mapActions } from 'pinia'
import useNotificationsStore from '@/stores/notifications'
import useUserStore from '@/stores/user'

export default {
  beforeRouteEnter(to, from, next) {
    const userStore = useUserStore()
    userStore.userLoggedIn ? next() : next({ name: 'home' })
  },
  props: ['user'],
  data() {
    return {
      isDragover: false,
      userSchema: {
        displayName: 'required|min:3|max:100|alphaSpaces'
      }
    }
  },
  computed: {
    ...mapWritableState(useUserStore, ['displayName', 'photoURL'])
  },
  methods: {
    ...mapActions(useUserStore, ['updateProfile', 'uploadPhoto']),
    ...mapActions(useNotificationsStore, ['setNotification']),

    validate() {
      // If validation pass update user store and details in Firebase.
      this.$refs.userDetailsForm.validate().then((result) => {
        if (result.valid) this.updateDetails()
      })
    },

    async updateDetails() {
      try {
        await this.updateProfile({
          displayName: this.displayName,
          photoURL: this.photoURL
        })
      } catch (error) {
        this.setNotification('error', 'Something went wrong', "We couldn't update your profile")
        return
      }

      this.setNotification('success', 'Success!', 'Profile details updated')
    },

    async updatePicture(event) {
      this.isDragover = false
      this.setNotification('notice', 'Please wait', 'New profile picture is uploaded')

      const file = event.dataTransfer
        ? [...event.dataTransfer.files][0]
        : [...event.target.files][0]

      if (file.type !== 'image/jpeg') {
        this.setNotification('error', 'Wrong file format', 'You can only upload jpeg files')
        return
      }

      try {
        await this.uploadPhoto(file)
      } catch (error) {
        this.setNotification(
          'error',
          'Something went wrong',
          "We couldn't change your profile picture"
        )
        return
      }

      this.setNotification('success', 'Look at this!', 'Your new profile picture looks fresh')
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#user-details {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: -164px -24px auto;
  background: linear-gradient(180deg, rgba($text-primary, 0.3) 0, $color-canvas 100%);
  padding: 176px 24px 48px;

  .user-picture {
    position: relative;
    margin-bottom: 24px;
    border-radius: 50%;
    background-color: $text-primary;
    padding: 0;
    width: 242px;
    height: 242px;
    color: $color-canvas;

    svg,
    label {
      position: absolute;
      top: 50% !important;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    img {
      @include user-photo;
    }

    label {
      display: block;
      cursor: pointer;
      border-radius: 50%;
      width: 242px;
      height: 242px;
      color: transparent;

      &.dragover {
        background-color: rgba($text-primary, 0.9);
        color: $text-primary-inverted;
      }
    }
  }

  form {
    display: flex;
    column-gap: 24px;
    row-gap: 8px;
    flex-direction: column;
    margin-top: 96px;
    width: 100%;

    div {
      @include form-element;
      @include form-element-error;
      width: 100%;
    }
  }

  @media (min-width: $lg) {
    margin-top: -128px;

    form {
      flex-direction: row;
    }
  }
}

#file-input {
  @include visually-hidden;
}
</style>
