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
          :title="!playing ? 'Play' : 'Pause'"
          @click.prevent="toggleAudio"
        >
          <eva-icon
            :name="!playing ? 'arrow-right-outline' : 'pause-circle-outline'"
            height="64"
            width="64"
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
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      album: {},
      songs: [],
      songsQuantity: 0,
    };
  },
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
  },

  methods: {
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
    margin: -36px -24px -48px;
    padding: 48px 24px;
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
  }
}
</style>
