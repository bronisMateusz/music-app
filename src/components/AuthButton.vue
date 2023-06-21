<template>
  <div class="auth-btn-wrapper">
    <button
      class="auth-btn"
      :title="!userLoggedIn ? 'Login / Register' : 'User menu'"
      @click.prevent="!userLoggedIn ? toggleAuthModal() : toggleContextMenu()"
    >
      <eva-icon v-if="!photoURL" name="people-outline" height="28" width="28" />
      <img v-else :src="photoURL" alt="user photo" />
    </button>
    <context-menu v-if="isContextMenuOpen" @closeMenu="isContextMenuOpen = false">
      <ul>
        <li>
          <router-link :to="{ name: 'user' }" @click.prevent="toggleContextMenu">
            Settings
          </router-link>
        </li>
        <li>
          <button title="Logout" @click.prevent="logout(), toggleContextMenu()">Logout</button>
        </li>
      </ul>
    </context-menu>
  </div>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import ContextMenu from '@/components/ContextMenu.vue'
import useAuthModalStore from '@/stores/auth-modal'
import useUserStore from '@/stores/user'

export default {
  data() {
    return {
      isContextMenuOpen: false
    }
  },
  components: { ContextMenu },
  computed: {
    ...mapWritableState(useAuthModalStore, ['isOpen']),
    ...mapState(useUserStore, ['photoURL', 'userId', 'userLoggedIn'])
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),

    toggleAuthModal() {
      this.isOpen = !this.isOpen
    },

    toggleContextMenu() {
      this.isContextMenuOpen = !this.isContextMenuOpen
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

.auth-btn-wrapper {
  position: relative;

  .auth-btn {
    position: relative;
    border-radius: 50px;
    background-color: $text-primary;
    padding: 0;
    width: 60px;
    height: 60px;
    color: $color-canvas;

    &:hover {
      background-color: $color-canvas;
      color: $text-primary;
    }

    svg,
    img {
      pointer-events: none;
    }

    img {
      @include user-photo;
    }
  }

  .context-menu {
    top: 100%;
    transform: unset;

    @media (min-width: $lg) {
      top: calc(100% + 12px);
      right: unset;
      left: 0;

      ul {
        text-align: left;

        a,
        button {
          padding-right: 48px;
          padding-left: 24px;
        }
      }
    }
  }
}
</style>
