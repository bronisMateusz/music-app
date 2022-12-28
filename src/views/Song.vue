<template>
  <div id="song">
    <div class="song-bg" />
    <div class="options">
      <router-link :to="{ name: 'home' }" title="Home">
        <eva-icon name="arrow-back-outline" height="28" width="28" />
      </router-link>
      <div class="options-group">
        <button>
          <eva-icon name="heart-outline" height="28" width="28" />
        </button>
        <button>
          <eva-icon name="share-outline" height="28" width="28" />
        </button>
        <button>
          <eva-icon name="more-horizontal-outline" height="28" width="28" />
        </button>
      </div>
    </div>
    <div class="song-switcher">
      <div class="previous-songs">
        <div class="song-cover"></div>
        <div class="song-cover"></div>
      </div>
      <div class="song-cover"></div>
      <div class="next-songs">
        <div class="song-cover"></div>
        <div class="song-cover"></div>
      </div>
    </div>
    <div class="player-controls">
      <!-- Song details -->
      <div class="song-details">
        <a href="#" class="song-title">{{ song.modified_name }}</a>
        <span class="song-artist">{{ song.display_name }}</span>
      </div>
      <!-- Progress bar -->
      <div class="progress-bar">
        <span class="time-remaining">2:28</span>
        <div class="bar">
          <div class="inner-bar" />
        </div>
        <span class="time-total">4:12</span>
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
        <button title="Play">
          <eva-icon name="arrow-right-outline" height="48" width="48" />
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
    </div>
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      song: {},
    };
  },
  async created() {
    const docRef = doc(db, "songs", this.$route.params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      this.$router.push({ name: "home" });
      return;
    }

    this.song = docSnap.data();
  },
};
</script>

<style lang="scss">
#song {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  width: 100vw;

  .song-bg {
    @include song-cover;
    filter: blur(150px);
    inset: 0;
    opacity: 0.7;
    position: absolute;
    z-index: -1;
  }

  .options {
    display: flex;
    justify-content: space-between;
    padding: 36px;
  }

  .song-switcher {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: auto 0;

    .previous-songs,
    .next-songs {
      display: none;
    }

    > .song-cover {
      @include song-cover;
      border-radius: 20px;
      box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.45);
      height: 220px;
      width: 220px;

      .playing {
        height: 280px;
        width: 280px;
      }
    }
  }

  .player-controls {
    margin: 36px 24px 48px;

    .song-details {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;

      .song-title {
        font-size: 1.125rem;
      }

      .song-artist {
        color: $text-secondary;
        font-size: 0.875rem;
      }
    }

    .progress-bar {
      @include progress-bar;
      margin-bottom: 24px;
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
  }

  @media (min-width: 768px) {
    .song-switcher {
      position: relative;

      .previous-songs,
      .next-songs {
        display: block;
        position: absolute;
        height: 240px;
        width: 240px;
        z-index: -1;

        .song-cover {
          @include song-cover;
          border-radius: 20px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);

          &:first-child {
            filter: blur(2px);
            height: 240px;
            width: 240px;
          }

          &:last-child {
            filter: blur(4px);
            height: 200px;
            width: 200px;
            z-index: -1;
          }
        }
      }

      .previous-songs {
        right: 50%;
        .song-cover:last-child {
          right: 50%;
        }
      }

      .next-songs {
        left: 50%;
        .song-cover:last-child {
          left: 50%;
        }
      }

      .song-cover {
        height: 280px;
        width: 280px;

        .playing {
          height: 340px;
          width: 340px;
        }
      }
    }

    .player-controls {
      display: grid;
      column-gap: 24px;
      grid-template-columns: 210px auto 210px;
      grid-template-rows: repeat(2, 1fr);
      padding: 0 12px;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      max-width: 950px;

      .control-buttons {
        grid-column: 1;
        grid-row: 1/3;
        gap: 0;
      }

      .song-details,
      .progress-bar {
        grid-column: 2;
        margin-bottom: 0;
      }

      .volume-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        grid-column: 3;
        grid-row: 1/3;

        .progress-bar {
          @include progress-bar;
        }

        button {
          padding: 0;
          width: 48px;
          height: 48px;
        }
      }
    }
  }
}
</style>
