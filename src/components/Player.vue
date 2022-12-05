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
      <button title="Play">
        <eva-icon name="arrow-right-outline" height="48" width="48" />
      </button>
      <!-- Next Button -->
      <button title="Next">
        <eva-icon name="rewind-right-outline" height="48" width="48" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
#player {
  @include blurred-bg();
  border-radius: 20px;
  bottom: 96px;
  left: 12px;
  position: fixed;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 12px;

  #player-controls {
    display: flex;
  }

  @media (min-width: 992px) {
    bottom: 24px;
    left: 24px;
    margin-left: 100px;
    right: 24px;
  }
}
</style>
