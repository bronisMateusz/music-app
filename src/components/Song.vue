<template>
  <ul class="songs">
    <li v-for="(song, index) in songs" :key="song.id">
      <div
        class="song-cover"
        :style="{
          'background-image': song.picture
            ? `url(${song.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
        }"
        @click.prevent="addSongs(song, index)"
      />
      <div class="song-details" @click.prevent="addSongs(song, index)">
        <button class="song-title">
          {{ song.title }}
        </button>
        <span class="song-artist">{{ song.artist }}</span>
      </div>
      <!-- Add to favorites Button -->
      <button
        v-if="!song.inFavorites"
        title="Add to favorites"
        @click.prevent="addToFav(song)"
      >
        <eva-icon class="options" name="heart-outline" height="28" width="28" />
      </button>
      <!-- Add to favorites Button -->
      <button
        v-else
        title="Remove from favorites"
        @click.prevent="removeFromFav(song)"
      >
        <eva-icon class="options" name="heart" height="28" width="28" />
      </button>
      <!-- Options Button -->
      <button>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </button>
    </li>
  </ul>
</template>

<script>
import { db } from "@/includes/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { mapActions, mapState, mapWritableState } from "pinia";
import usePlayerStore from "@/stores/player";
import useUserStore from "@/stores/user";

export default {
  props: ["songs"],
  emits: ["albumId"],
  computed: {
    ...mapState(useUserStore, ["userId"]),
    ...mapWritableState(usePlayerStore, ["currentSongIndex", "songsQueue"]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),

    addSongs(song, index) {
      this.songsQueue = this.songs;
      this.currentSongIndex = index;
      this.newSong(song);
      this.$emit("albumId", song.album_id);
    },

    async addToFav(song) {
      const favoritesRef = doc(db, "favorites", this.userId);
      const favoritesSnapshot = await getDoc(favoritesRef);

      if (favoritesSnapshot.exists()) {
        await updateDoc(favoritesRef, {
          songs: arrayUnion({ id: song.id }),
        });
      } else {
        await setDoc(favoritesRef, {
          songs: [{ id: song.id }],
        });
      }

      song.inFavorites = true;
    },

    async removeFromFav(song) {
      await updateDoc(doc(db, "favorites", this.userId), {
        songs: arrayRemove({ id: song.id }),
      });

      song.inFavorites = false;
    },
  },
};
</script>

<style lang="scss">
.songs {
  @include songs-list;

  .song-details {
    @include song-details;
  }
}
</style>
