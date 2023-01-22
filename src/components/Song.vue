<template>
  <ul class="songs">
    <li v-for="(song, index) in songs" :key="song.id" class="song">
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
        v-if="userLoggedIn && !song.inFavorites"
        title="Add to favorites"
        @click.prevent="addToFavorites('songs', song)"
      >
        <eva-icon name="heart-outline" height="28" width="28" />
      </button>
      <!-- Remove from favorites Button -->
      <button
        v-if="userLoggedIn && song.inFavorites"
        title="Remove from favorites"
        @click.prevent="removeFromFavorites('songs', song)"
      >
        <eva-icon name="heart" height="28" width="28" />
      </button>
      <!-- More Button -->
      <button
        title="More"
        @click.prevent="(contextMenuIndex = index), toggleContextMenu()"
      >
        <eva-icon name="more-horizontal-outline" height="28" width="28" />
      </button>
      <context-menu
        v-if="isContextMenuOpen && contextMenuIndex === index"
        @closeMenu="isContextMenuOpen = false"
      >
        <ul>
          <li>
            <button @click.prevent="toggleContextMenu">Add to playlist</button>
          </li>
          <li>
            <button @click.prevent="next(song), toggleContextMenu()">
              Next
            </button>
          </li>
          <li>
            <button @click.prevent="last(song), toggleContextMenu()">
              Play last
            </button>
          </li>
        </ul>
      </context-menu>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapState, mapWritableState } from "pinia";
import ContextMenu from "@/components/ContextMenu.vue";
import useFavoritesStore from "@/stores/favorites";
import usePlayerStore from "@/stores/player";
import useUserStore from "@/stores/user";

export default {
  props: ["songs"],
  emits: ["albumId"],
  components: { ContextMenu },
  data() {
    return {
      contentMenuIndex: 0,
      isContextMenuOpen: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ["userId", "userLoggedIn"]),
    ...mapWritableState(usePlayerStore, ["currentSongIndex", "songsQueue"]),
  },
  methods: {
    ...mapActions(useFavoritesStore, ["addToFavorites", "removeFromFavorites"]),
    ...mapActions(usePlayerStore, ["last", "next", "newSong"]),

    addSongs(song, index) {
      this.songsQueue = [...this.songs];
      this.currentSongIndex = index;
      this.newSong(song);
      this.$emit("albumId", song.albumId);
    },

    toggleContextMenu() {
      this.isContextMenuOpen = !this.isContextMenuOpen;
    },
  },
};
</script>

<style lang="scss">
.songs {
  @include songs-list;

  .song {
    position: relative;
  }

  .song-details {
    @include song-details;
  }
}
</style>
