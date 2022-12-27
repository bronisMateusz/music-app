<template>
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
</template>

<script></script>

<style lang="scss">
* {
  margin: 0;
  box-sizing: border-box;
}

a {
  color: $text-primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.hidden {
  display: none;
}

button {
  background-color: transparent;
  border-style: none;
  cursor: pointer;
  color: $text-secondary;

  &:hover {
    color: $text-primary;
  }
}

body {
  background-color: $color-canvas;
  color: $text-primary;
  font-family: "Josefin Sans", sans-serif;
  font-weight: 500;

  @include scrollbar-styles;

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    #playlist {
      @include songs-list;

      .song-details {
        @include song-details(2);
      }
    }
  }
}
</style>
