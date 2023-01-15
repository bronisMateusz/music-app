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
      <eva-icon
        class="options"
        name="more-horizontal-outline"
        height="28"
        width="28"
      />
    </li>
  </ul>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  props: ["songs"],
  emits: ["albumId"],
  computed: {
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
