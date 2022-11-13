<template>
  <!-- Header -->
  <app-header />
  <!-- Main Content -->
  <main>
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
  <auth />

  <!-- Footer -->
  <app-footer />
</template>

<script>
import AppHeader from "@/components/Header.vue";
import Player from "@/components/Player.vue";
import Auth from "@/components/Auth.vue";
import AppFooter from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    Player,
    Auth,
    AppFooter,
  },
};
</script>
