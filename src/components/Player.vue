<template>
  <div id="player">
    <player-details :showCover="true" />
  </div>
</template>

<script>
import PlayerDetails from "@/components/PlayerDetails.vue";

export default {
  components: { PlayerDetails },
};
</script>

<style lang="scss">
#player {
  @include blurred-bg($color-element);
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

  @media (min-width: $md) {
    grid-template-columns: 70px auto 240px;
    grid-template-rows: repeat(2, 1fr);

    .song-cover,
    .control-buttons {
      grid-row: 1/3;
    }

    .song-details {
      text-align: center;

      .song-title {
        text-align: center;
      }
    }

    .progress-bar {
      display: flex;
    }

    .control-buttons {
      grid-column: 3;
      gap: 0;

      button {
        &:first-of-type,
        &:nth-of-type(2),
        &:last-of-type {
          display: block;
        }
      }
    }
  }

  @media (min-width: $lg) {
    bottom: 24px;
    grid-template-columns: 240px 70px auto 200px;
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

    .progress-bar {
      grid-column: 3;
    }

    .volume-controls {
      display: flex;
      grid-column: 4;
      grid-row: 1/3;
    }

    .control-buttons {
      grid-column: 1;
    }
  }
}
</style>
