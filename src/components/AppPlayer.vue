<template>
  <div id="player">
    <player-details :showCover="true" />
  </div>
</template>

<script>
import PlayerDetails from '@/components/PlayerDetails.vue'

export default {
  components: { PlayerDetails }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#player {
  @include blurred-bg($color-element);
  display: grid;
  position: fixed;
  right: 12px;
  bottom: 82px;
  left: 12px;
  grid-template-columns: 70px auto 108px;
  column-gap: 12px;
  align-items: center;
  border-radius: 20px;
  padding: 12px;

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
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: 70px auto 240px;

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
    right: 24px;
    bottom: 24px;
    left: 24px;
    grid-template-columns: 240px 70px auto 200px;
    margin-left: 100px;

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
      grid-row: 1/3;
      grid-column: 4;
    }

    .control-buttons {
      grid-column: 1;
    }
  }
}
</style>
