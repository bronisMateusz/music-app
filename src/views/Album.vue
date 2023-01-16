<template>
  <div id="album">
    <div class="album-details">
      <div
        class="album-cover"
        :style="{
          'background-image': album.picture
            ? `url(${album.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
        }"
      />
      <h2 class="title">{{ album.name }}</h2>
      <a class="artist" href="#">{{ album.artist }}</a>
      <p class="songs-quantity">{{ songs.length }} songs</p>
      <div class="actions">
        <!-- Play/Pause Button -->
        <button
          :title="
            !(playing && album.id === currentSong.albumId) ? 'Play' : 'Pause'
          "
          @click.prevent="playAlbum"
        >
          <eva-icon
            :name="
              !(playing && album.id === currentSong.albumId)
                ? 'arrow-right-outline'
                : 'pause-circle-outline'
            "
            height="72"
            width="72"
          />
        </button>
        <!-- Add to favorites Button -->
        <button
          v-if="!album.inFavorites"
          title="Add to favorites"
          @click.prevent="addToFav"
        >
          <eva-icon
            class="options"
            name="heart-outline"
            height="48"
            width="48"
          />
        </button>
        <!-- Remove from favorites Button -->
        <button
          v-else
          title="Remove from favorites"
          @click.prevent="removeFromFav"
        >
          <eva-icon class="options" name="heart" height="48" width="48" />
        </button>
        <button title="favorites">
          <eva-icon
            name="more-horizontal-outline"
            height="48"
            width="48"
          ></eva-icon>
        </button>
      </div>
    </div>
    <song :songs="songs" @album-id="isAlbumPlaying = album.id === $event" />
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import {
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { mapActions, mapState, mapWritableState } from "pinia";
import Song from "@/components/Song.vue";
import usePlayerStore from "@/stores/player";
import useUserStore from "@/stores/user";

export default {
  data() {
    return {
      album: {},
      songs: [],
    };
  },
  components: { Song },
  async created() {
    // Get the album document
    const albumRef = doc(db, "albums", this.$route.params.id);
    const albumSnap = await getDoc(albumRef);

    // Get user's favorites songs
    const favoritesRef = doc(db, "favorites", this.userId);
    const favoritesSnapshot = await getDoc(favoritesRef);

    if (!albumSnap.exists()) {
      this.$router.push({ name: "home" });
      return;
    }
    const favoriteAlbums =
      (favoritesSnapshot.data() && favoritesSnapshot.data().songs) || [];
    this.addAlbum(albumSnap, favoriteAlbums);

    // Get favorite songs from the snapshot or create empty array
    const favoriteSongs =
      (favoritesSnapshot.data() && favoritesSnapshot.data().songs) || [];

    const songs = this.album.songs;
    for (let i = 0; i < songs.length; i++) {
      const songRef = doc(db, "songs", songs[i].id);
      const songSnap = await getDoc(songRef);
      this.addSong(songSnap, favoriteSongs);
    }
  },
  computed: {
    ...mapState(useUserStore, ["userId"]),
    ...mapWritableState(usePlayerStore, [
      "currentSong",
      "currentSongIndex",
      "playing",
      "songsQueue",
    ]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong", "toggleAudio"]),

    addAlbum(doc, favoriteAlbums) {
      this.album = {
        ...doc.data(),
        id: doc.id,
        inFavorites: favoriteAlbums.some((favAlbum) => favAlbum.id === doc.id),
      };
    },

    addSong(doc, favoriteSongs) {
      const song = {
        ...doc.data(),
        id: doc.id,
        // Check if the song id is found in the favoriteSongs array
        inFavorites: favoriteSongs.some((favSong) => favSong.id === doc.id),
      };
      this.songs.push(song);
    },

    async addToFav() {
      const favoritesRef = doc(db, "favorites", this.userId);
      const favoritesSnapshot = await getDoc(favoritesRef);

      if (favoritesSnapshot.exists()) {
        await updateDoc(favoritesRef, {
          albums: arrayUnion({ id: this.album.id }),
        });
      } else {
        await setDoc(favoritesRef, {
          songs: [{ id: this.album.id }],
        });
      }

      this.album.inFavorites = true;
    },

    playAlbum() {
      if (!(this.playing && this.album.id === this.currentSong.albumId)) {
        this.songsQueue = this.songs;
        this.currentSongIndex = 0;
        this.newSong(this.songs[0]);
        return;
      }

      this.toggleAudio();
    },

    async removeFromFav() {
      await updateDoc(doc(db, "favorites", this.userId), {
        albums: arrayRemove({ id: this.album.id }),
      });

      this.album.inFavorites = false;
    },
  },
};
</script>

<style lang="scss">
#album {
  .album-details {
    background: linear-gradient(
      180deg,
      rgba($text-primary, 0.3) 0,
      $color-canvas 100%
    );
    display: grid;
    justify-content: center;
    margin: -164px -24px auto;
    padding: 176px 24px 48px;
    row-gap: 12px;
    text-align: center;

    .album-cover {
      @include album-cover;
      margin: 0 auto 12px;
    }

    .title {
      line-height: 2.5rem;
    }

    .artist {
      font-size: 24px;
      line-height: 2rem;
    }

    .songs-quantity {
      color: $text-secondary;
    }

    .actions {
      display: flex;
      gap: 24px;
      justify-content: center;

      button {
        height: 64px;
        padding: 0;
        width: 64px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    @media (min-width: 992px) {
      column-gap: 24px;
      grid-template-columns: 260px 1fr;
      margin-top: -128px;
      row-gap: 0;
      text-align: left;

      .album-cover {
        grid-row: 1/5;
        margin-bottom: 0;
      }

      .title,
      .artist,
      .songs-quantity,
      .actions {
        grid-column: 2;
      }

      .title {
        align-self: flex-end;
        line-height: 3.5rem;
        font-size: 48px;
      }

      .artist {
        align-self: center;
      }

      .songs-quantity {
        align-self: flex-start;
      }

      .actions {
        align-self: flex-end;
        justify-content: flex-start;
      }
    }
  }
}
</style>
