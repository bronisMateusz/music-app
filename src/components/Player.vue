<template>
  <div id="player">
    <div class="song-details">
      <span class="song-cover" />
      <a href="#" class="song-title">Song Title</a>
      <span class="song-artist">Artist Name</span>
    </div>
    <div id="player-controls">
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio"]),
  },
  computed: {
    ...mapState(usePlayerStore, ["playing"]),
  },
};
</script>

<style lang="scss">
#player {
  @include blurred-bg;
  border-radius: 20px;
  bottom: 82px;
  left: 12px;
  position: fixed;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 12px;

  .song-details {
    @include song-details(2);
  }

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
