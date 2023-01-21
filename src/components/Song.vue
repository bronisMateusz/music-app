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
        <eva-icon name="heart-outline" height="28" width="28" />
      </button>
      <!-- Remove from favorites Button -->
      <button
        v-else
        title="Remove from favorites"
        @click.prevent="removeFromFav(song)"
      >
        <eva-icon name="heart" height="28" width="28" />
      </button>
      <!-- Options Button -->
      <button>
        <eva-icon name="more-horizontal-outline" height="28" width="28" />
      </button>
    </li>
  </ul>
</template>

<script>
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
    ...mapActions(usePlayerStore, ["addToFav", "removeFromFav", "newSong"]),

    addSongs(song, index) {
      this.songsQueue = this.songs;
      this.currentSongIndex = index;
      this.newSong(song);
      this.$emit("albumId", song.albumId);
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
