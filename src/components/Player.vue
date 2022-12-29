<template>
  <div id="player">
    <player-details :song="currentSong" :showCover="true" />
  </div>
</template>

<script>
import PlayerDetails from "@/components/PlayerDetails.vue";
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  components: { PlayerDetails },
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio"]),
  },
  computed: {
    ...mapState(usePlayerStore, ["playing", "currentSong"]),
  },
};
</script>

<style lang="scss">
#player {
  @include blurred-bg;
  align-items: center;
  border-radius: 20px;
  bottom: 82px;
  column-gap: 12px;
  display: grid;
  grid-template-columns: 70px auto 108px;
  left: 12px;
  padding: 12px;
  position: fixed;
  right: 12px;

  .song-details {
    @include song-details;
  }

  .progress-bar {
    display: none;
  }

  .control-buttons {
    button {
      &:first-of-type,
      &:nth-of-type(2),
      &:last-of-type {
        display: none;
      }
    }
  }

  @media (min-width: 768px) {
    grid-template-columns: 70px auto 288px;
    grid-template-rows: repeat(2, 1fr);

    .song-cover,
    .control-buttons {
      grid-row: 1/3;
    }

    .song-details {
      text-align: center;
    }

    .progress-bar {
      display: flex;
    }

    .control-buttons {
      grid-column: 3;

      button {
        &:first-of-type,
        &:nth-of-type(2),
        &:last-of-type {
          display: block;
        }
      }
    }
  }

  @media (min-width: 992px) {
    bottom: 24px;
    left: 24px;
    margin-left: 100px;
    right: 24px;

    .song-details {
      .song-title {
        font-size: 1rem;
      }

      .song-artist {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
