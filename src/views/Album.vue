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
          :title="!isAlbumPlaying ? 'Play' : 'Pause'"
          @click.prevent="playAlbum"
        >
          <eva-icon
            :name="
              !isAlbumPlaying ? 'arrow-right-outline' : 'pause-circle-outline'
            "
            height="48"
            width="48"
          />
        </button>
        <button title="favorites">
          <eva-icon name="heart-outline" height="48" width="48"></eva-icon>
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
import { doc, getDoc } from "firebase/firestore";
import Song from "@/components/Song.vue";
import { mapActions, mapWritableState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  data() {
    return {
      album: {},
      songs: [],
      isAlbumPlaying: false,
    };
  },
  components: { Song },
  async created() {
    const albumRef = doc(db, "albums", this.$route.params.id);
    const albumSnap = await getDoc(albumRef);

    if (!albumSnap.exists()) {
      this.$router.push({ name: "home" });
      return;
    }

    this.addAlbum(albumSnap);

    const songs = this.album.songs;
    for (let i = 0; i < songs.length; i++) {
      const songRef = doc(db, "songs", songs[i].id);
      const songSnap = await getDoc(songRef);
      this.addSong(songSnap);
    }

    this.isAlbumPlaying = this.playing && doc.id === this.albumId;
  },
  computed: {
    ...mapWritableState(usePlayerStore, [
      "albumId",
      "currentSongIndex",
      "playing",
      "songsQueue",
    ]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong", "toggleAudio"]),

    addAlbum(doc) {
      this.album = {
        ...doc.data(),
        id: doc.id,
      };
    },

    addSong(doc) {
      const song = {
        ...doc.data(),
        id: doc.id,
      };
      this.songs.push(song);
    },

    playAlbum() {
      if (!this.isAlbumPlaying) {
        this.songsQueue = this.songs;
        this.currentSongIndex = 0;
        this.newSong(this.songs[0]);
        this.isAlbumPlaying = true;
        return;
      }

      this.isAlbumPlaying = false;
      this.toggleAudio();
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
