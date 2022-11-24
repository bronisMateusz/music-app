<template>
  <div id="player">
    <!-- Scrub -->
    <div class="song-details">
      <span class="song-cover" />
      <a href="#" class="song-title">Song Title</a>
      <span class="song-artist">Artist Name</span>
    </div>
    <div id="player-controls">
      <!-- Play/Pause Button -->
      <button type="button">
        <eva-icon name="arrow-right-outline" height="48" width="48" />
      </button>
      <!-- Rewind Right Button -->
      <button type="button">
        <eva-icon name="rewind-right-outline" height="48" width="48" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
#player {
  background-color: rgba($color: $color-element, $alpha: 0.5);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  bottom: 24px;
  left: 24px;
  position: fixed;
  right: 24px;
  display: flex;
  align-items: center;
  padding: 12px;

  #player-controls {
    display: flex;

    button {
      background-color: transparent;
      border: none;
      color: $text-secondary;

      &:hover {
        color: $text-primary;
      }
    }
  }
}
</style>
