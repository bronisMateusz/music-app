<template>
  <!-- Song details -->
  <div v-show="showCover" class="song-cover" />
  <div class="song-details">
    <a href="#" class="song-title">{{ currentSong.modified_name }}</a>
    <span class="song-artist">{{ currentSong.display_name }}</span>
  </div>
  <!-- Progress bar -->
  <div class="progress-bar">
    <span class="time-remaining">{{ seek }}</span>
    <div class="bar">
      <div class="inner-bar" :style="{ width: playerProgress }" />
    </div>
    <span class="time-total">{{ duration }}</span>
  </div>
  <div class="control-buttons">
    <!-- Shuffle Button -->
    <button title="Shuffle">
      <eva-icon name="shuffle-2-outline" height="24" width="24" />
    </button>
    <!-- Previous Button -->
    <button title="Previous">
      <eva-icon name="rewind-left-outline" height="48" width="48" />
    </button>
    <!-- Play/Pause Button -->
    <button :title="!playing ? 'Play' : 'Pause'" @click.prevent="toggleAudio">
      <eva-icon
        :name="!playing ? 'arrow-right-outline' : 'pause-circle-outline'"
        height="48"
        width="48"
      />
    </button>
    <!-- Next Button -->
    <button title="Next">
      <eva-icon name="rewind-right-outline" height="48" width="48" />
    </button>
    <!-- Repeat Button -->
    <button title="Repeat">
      <eva-icon name="repeat-outline" height="24" width="24" />
    </button>
  </div>
  <div class="volume-controls">
    <!-- Decrease Volume Button -->
    <button title="Decrease volume">
      <eva-icon name="volume-mute-outline" height="24" width="24" />
    </button>
    <!-- Progress bar -->
    <div class="progress-bar">
      <div class="bar">
        <div class="inner-bar" />
      </div>
    </div>
    <!-- Increase Volume Button -->
    <button title="Increase volume">
      <eva-icon name="volume-up-outline" height="24" width="24" />
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  props: {
    showCover: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong", "toggleAudio"]),
  },
  computed: {
    ...mapState(usePlayerStore, [
      "playing",
      "seek",
      "duration",
      "playerProgress",
      "currentSong",
    ]),
  },
};
</script>

<style lang="scss">
.song-cover {
  @include conic-bg;
  border-radius: 15px;
  height: 70px;
  min-width: 70px;
  width: 70px;
}

.progress-bar {
  @include progress-bar;
}

.control-buttons {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 12px;

  button {
    padding: 0;
    height: 48px;
    width: 48px;
  }
}

.volume-controls {
  display: none;
}

@media (min-width: 768px) {
}
</style>
