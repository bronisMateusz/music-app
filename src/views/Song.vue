<template>
  <div id="song">
    <notification />
    <div
      class="song-bg"
      :style="{
        'background-image': currentSong.picture
          ? `url(${currentSong.picture})`
          : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
      }"
    />
    <div class="options">
      <button title="Back" @click.prevent="goBack">
        <eva-icon name="arrow-back-outline" height="28" width="28" />
      </button>
      <div class="options-group">
        <!-- Add to favorites Button -->
        <button
          v-if="userLoggedIn && !currentSong.inFavorites"
          title="Add to favorites"
          @click.prevent="addToFavorites('songs', currentSong)"
        >
          <eva-icon name="heart-outline" height="28" width="28" />
        </button>
        <!-- Remove from favorites Button -->
        <button
          v-if="userLoggedIn && currentSong.inFavorites"
          title="Remove from favorites"
          @click.prevent="removeFromFavorites('songs', currentSong)"
        >
          <eva-icon name="heart" height="28" width="28" />
        </button>
        <!-- Share Button -->
        <button title="Share" @click.prevent="copyLink">
          <eva-icon name="share-outline" height="28" width="28" />
        </button>
        <!-- More Button -->
        <button title="More">
          <eva-icon name="more-horizontal-outline" height="28" width="28" />
        </button>
      </div>
    </div>
    <div class="song-switcher">
      <div v-if="songsQueue.length" class="previous-songs">
        <div
          class="song-cover"
          :style="{
            'background-image':
              songsQueue[currentSongIndex - 1] &&
              songsQueue[currentSongIndex - 1].picture
                ? `url(${songsQueue[currentSongIndex - 1].picture})`
                : songsQueue[songsQueue.length - 1] &&
                  songsQueue[songsQueue.length - 1].picture
                ? `url(${songsQueue[songsQueue.length - 1].picture})`
                : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
        />
        <div
          v-show="songsQueue.length > 2"
          class="song-cover"
          :style="{
            'background-image':
              songsQueue[currentSongIndex - 2] &&
              songsQueue[currentSongIndex - 2].picture
                ? `url(${songsQueue[currentSongIndex - 2].picture})`
                : songsQueue[songsQueue.length - 2] &&
                  songsQueue[songsQueue.length - 2].picture
                ? `url(${songsQueue[songsQueue.length - 2].picture})`
                : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
        />
      </div>
      <div
        class="song-cover"
        :class="playing ? 'playing' : ''"
        :style="{
          'background-image': currentSong.picture
            ? `url(${currentSong.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
        }"
      />
      <div v-if="songsQueue.length" class="next-songs">
        <div
          class="song-cover"
          :style="{
            'background-image':
              songsQueue[currentSongIndex + 1] &&
              songsQueue[currentSongIndex + 1].picture
                ? `url(${songsQueue[currentSongIndex + 1].picture})`
                : songsQueue[0] && songsQueue[0].picture
                ? `url(${songsQueue[0].picture})`
                : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
        />
        <div
          v-show="songsQueue.length > 2"
          class="song-cover"
          :style="{
            'background-image':
              songsQueue[currentSongIndex + 2] &&
              songsQueue[currentSongIndex + 2].picture
                ? `url(${songsQueue[currentSongIndex + 2].picture})`
                : songsQueue[1] && songsQueue[1].picture
                ? `url(${songsQueue[1].picture})`
                : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
        />
      </div>
    </div>
    <div class="player-controls">
      <player-details
        @changeSong="
          this.$router.push({ name: 'song', params: { id: $event } })
        "
      />
    </div>
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import { doc, getDoc } from "firebase/firestore";
import { mapActions, mapState, mapWritableState } from "pinia";

import Notification from "@/components/Notification.vue";
import PlayerDetails from "@/components/PlayerDetails.vue";

import useFavoritesStore from "@/stores/favorites";
import useNotificationsStore from "@/stores/notifications";
import usePlayerStore from "@/stores/player";
import useUserStore from "@/stores/user";

export default {
  components: { Notification, PlayerDetails },
  data() {
    return {
      previousViewPath: "",
    };
  },
  async created() {
    // Keep the path of the view from which the view of the song was called.
    this.previousViewPath = this.$router.options.history.state.back;

    if (!this.currentSong.id) {
      const songRef = doc(db, "songs", this.$route.params.id);
      const songSnap = await getDoc(songRef);

      if (!songSnap.exists()) {
        this.$router.push({ name: "home" });
        return;
      }

      await this.newSong({
        ...songSnap.data(),
        id: songSnap.id,
        // Check if the song id is favoriteSongs
        inFavorites: this.favSongs.some(
          (favSong) => favSong.id === songSnap.id
        ),
      });
      this.sound.pause();
    }
  },
  computed: {
    ...mapState(useUserStore, ["userId", "userLoggedIn"]),
    ...mapState(useFavoritesStore, ["favSongs"]),
    ...mapWritableState(usePlayerStore, [
      "currentSong",
      "currentSongIndex",
      "playing",
      "songsQueue",
      "sound",
    ]),
  },
  methods: {
    ...mapActions(useFavoritesStore, ["addToFavorites", "removeFromFavorites"]),
    ...mapActions(useNotificationsStore, ["setNotification"]),
    ...mapActions(usePlayerStore, ["newSong"]),

    async getFavorites() {
      const favoritesRef = doc(db, "favorites", this.userId);
      const favoritesSnapshot = await getDoc(favoritesRef);

      // Get favorites songs
      return (favoritesSnapshot.data() && favoritesSnapshot.data().songs) || [];
    },

    goBack() {
      const router = this.$router;

      // If router history store before route path, go to previousViewPath
      // else go back to home
      router.options.history.state.back
        ? router.push({ path: this.previousViewPath })
        : router.push({ name: "home" });
    },

    copyLink() {
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          this.setNotification(
            "success",
            "Link copied",
            "You can now share this song!"
          );
        },
        () => {
          this.setNotification(
            "error",
            "Sorry",
            "We couldn't prepare share link"
          );
        }
      );
    },
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
    filter: blur(150px);
    inset: 0;
    opacity: 0.7;
    position: absolute;
    z-index: -1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .options {
    display: flex;
    justify-content: space-between;
    padding: 24px;
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
      animation: zoom-out 0.3s ease-in-out;
      border-radius: 20px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 15px -3px,
        rgba(0, 0, 0, 0.175) 0px 4px 6px -2px;
      height: 275px;
      width: 275px;
      scale: 0.8;

      &.playing {
        animation: zoom-in 0.5s ease-in-out;
        box-shadow: rgba(50, 50, 93, 0.4) 0px 13px 27px -5px,
          rgba(0, 0, 0, 0.5) 0px 8px 16px -8px;
        scale: 1;
      }
    }
  }

  .player-controls {
    margin: 36px 24px 36px;

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
        transform: translateY(-10%);

        .song-cover {
          background-image: conic-gradient(
            from 180deg at 50% 50%,
            #616db9 0deg,
            #bfc5fc 360deg
          );
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
        height: 325px;
        width: 325px;
        scale: 0.8;

        &.playing {
          scale: 1;
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
  @keyframes zoom-in {
    0% {
      box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 15px -3px,
        rgba(0, 0, 0, 0.175) 0px 4px 6px -2px;
      scale: 0.8;
    }
    50% {
      scale: 1.1;
    }
    100% {
      box-shadow: rgba(50, 50, 93, 0.4) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.5) 0px 8px 16px -8px;
      scale: 1;
    }
  }

  @keyframes zoom-out {
    0% {
      box-shadow: rgba(50, 50, 93, 0.4) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.5) 0px 8px 16px -8px;
      scale: 1;
    }
    100% {
      box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 15px -3px,
        rgba(0, 0, 0, 0.175) 0px 4px 6px -2px;
      scale: 0.8;
    }
  }
}
</style>
