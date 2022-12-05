<template>
  <!-- Header -->
  <app-header />
  <!-- Main Content -->
  <main>
    <navigation />
    <section>
      <h2>Songs</h2>
      <!-- Playlist -->
      <ul id="playlist">
        <li>
          <div class="song-details">
            <span class="song-cover" />
            <a href="#" class="song-title">Song Title</a>
            <span class="song-artist">Artist Name</span>
          </div>
          <eva-icon
            class="options"
            name="more-horizontal-outline"
            height="28"
            width="28"
          />
        </li>
        <li>
          <div class="song-details">
            <span class="song-cover" />
            <a href="#" class="song-title">Song Title</a>
            <span class="song-artist">Artist Name</span>
          </div>
          <eva-icon
            class="options"
            name="more-horizontal-outline"
            height="28"
            width="28"
          />
        </li>
        <li>
          <div class="song-details">
            <span class="song-cover" />
            <a href="#" class="song-title">Song Title</a>
            <span class="song-artist">Artist Name</span>
          </div>
          <eva-icon
            class="options"
            name="more-horizontal-outline"
            height="28"
            width="28"
          />
        </li>
        <li>
          <div class="song-details">
            <span class="song-cover" />
            <a href="#" class="song-title">Song Title</a>
            <span class="song-artist">Artist Name</span>
          </div>
          <eva-icon
            class="options"
            name="more-horizontal-outline"
            height="28"
            width="28"
          />
        </li>
        <li>
          <div class="song-details">
            <span class="song-cover" />
            <a href="#" class="song-title">Song Title</a>
            <span class="song-artist">Artist Name</span>
          </div>
          <eva-icon
            class="options"
            name="more-horizontal-outline"
            height="28"
            width="28"
          />
        </li>
      </ul>
      <!-- .. end Playlist -->
    </section>
  </main>

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth-modal />

  <!-- Footer -->
  <app-footer />
</template>

<script>
import AppHeader from "@/components/Header.vue";
import Navigation from "@/components/Navigation.vue";
import Player from "@/components/Player.vue";
import AuthModal from "@/components/AuthModal.vue";
import AppFooter from "@/components/Footer.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    Navigation,
    Player,
    AuthModal,
    AppFooter,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) this.userLoggedIn = true;
  },
};
</script>

<style lang="scss">
main {
  padding: 138px 24px 48px;
  flex-direction: column;

  section > h2 {
    margin: 24px 0;
  }

  #playlist {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    row-gap: 18px;

    li {
      background-color: $color-element;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      padding: 12px;

      .options {
        align-self: center;
      }
    }
  }
}
@media (min-width: 992px) {
  main {
    margin-left: 100px;
    padding-top: 90px;
  }
}
</style>
