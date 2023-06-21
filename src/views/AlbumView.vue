<template>
  <div id="album">
    <div class="album-details">
      <div
        class="album-cover"
        :style="{
          'background-image': album.picture
            ? `url(${album.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)'
        }"
      />
      <h2 class="title">{{ album.name || 'Undefined' }}</h2>
      <a class="artist" href="#">{{ album.artist || 'Undefined' }}</a>
      <p class="songs-quantity">{{ songs.length }} songs</p>
      <div class="actions">
        <!-- Play/Pause Button -->
        <button
          :title="!(playing && album.id === currentSong.albumId) ? 'Play' : 'Pause'"
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
          v-if="userLoggedIn && !album.inFavorites"
          title="Add to favorites"
          @click.prevent="addToFavorites('albums', album)"
        >
          <eva-icon name="heart-outline" height="48" width="48" />
        </button>
        <!-- Remove from favorites Button -->
        <button
          v-if="userLoggedIn && album.inFavorites"
          title="Remove from favorites"
          @click.prevent="removeFromFavorites('albums', album)"
        >
          <eva-icon name="heart" height="48" width="48" />
        </button>
        <button title="More" @click.prevent="toggleContextMenu">
          <eva-icon name="more-horizontal-outline" height="48" width="48" />
        </button>
        <context-menu v-if="isContextMenuOpen" @closeMenu="isContextMenuOpen = false">
          <ul>
            <li>
              <button @click.prevent="toggleContextMenu">Add to playlist</button>
            </li>
            <li>
              <button @click.prevent="nextAlbum(), toggleContextMenu()">Next</button>
            </li>
            <li>
              <button @click.prevent="lastAlbum(), toggleContextMenu()">Play last</button>
            </li>
          </ul>
        </context-menu>
      </div>
    </div>
    <songs-list :songs="songs" @album-id="isAlbumPlaying = album.id === $event" />
  </div>
</template>

<script>
import { db } from '@/includes/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { mapActions, mapState, mapWritableState } from 'pinia'

import ContextMenu from '@/components/ContextMenu.vue'
import SongsList from '@/components/SongsList.vue'

import useFavoritesStore from '@/stores/favorites'
import usePlayerStore from '@/stores/player'
import useUserStore from '@/stores/user'

export default {
  components: { ContextMenu, SongsList },
  data() {
    return {
      album: {},
      isContextMenuOpen: false,
      songs: []
    }
  },
  async created() {
    // Get album doc
    const albumRef = doc(db, 'albums', this.$route.params.id)
    const albumSnap = await getDoc(albumRef)

    if (!albumSnap.exists()) {
      this.$router.push({ name: 'home' })
      return
    }

    this.addAlbum(albumSnap)
    await this.getSongs()
  },
  computed: {
    ...mapState(useUserStore, ['userId', 'userLoggedIn']),
    ...mapState(useFavoritesStore, ['favSongs', 'favAlbums']),
    ...mapWritableState(usePlayerStore, [
      'currentSong',
      'currentSongIndex',
      'playing',
      'songsQueue'
    ])
  },
  methods: {
    ...mapActions(useFavoritesStore, ['addToFavorites', 'removeFromFavorites']),
    ...mapActions(usePlayerStore, ['last', 'next', 'newSong', 'toggleAudio']),

    addAlbum(doc) {
      this.album = {
        ...doc.data(),
        id: doc.id,
        // Check if the album id is favoriteAlbum
        inFavorites: this.favAlbums.some((favAlbum) => favAlbum.id === doc.id)
      }
    },

    addSong(doc) {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
        // Check if the song id is in favoriteSongs
        inFavorites: this.favSongs.some((favSong) => favSong.id === doc.id)
      })
    },

    async getSongs() {
      for (const song of this.album.songs) {
        const songRef = doc(db, 'songs', song.id)
        const songSnap = await getDoc(songRef)
        this.addSong(songSnap)
      }
    },

    nextAlbum() {
      this.songsQueue.splice(1, 0, ...this.songs)
    },

    lastAlbum() {
      this.songsQueue = [...this.songsQueue, ...this.songs]
    },

    playAlbum() {
      if (this.album.id !== this.currentSong.albumId) {
        this.songsQueue = [...this.songs]
        this.currentSongIndex = 0
        this.newSong(this.songs[0])
        return
      }

      this.toggleAudio()
    },

    toggleContextMenu() {
      this.isContextMenuOpen = !this.isContextMenuOpen
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins.scss' as *;
@use '@/assets/scss/variables.scss' as *;

#album {
  .album-details {
    display: grid;
    row-gap: 12px;
    justify-content: center;
    margin: -164px -24px auto;
    background: linear-gradient(180deg, rgba($text-primary, 0.3) 0, $color-canvas 100%);
    padding: 176px 24px 48px;
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
      position: relative;
      justify-content: center;
      gap: 24px;

      > button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        width: 64px;
        height: 64px;
        overflow: hidden;
      }

      .context-menu {
        top: -100%;
        right: 36px;
      }
    }
    @media (min-width: $lg) {
      grid-template-columns: 260px 1fr;
      column-gap: 24px;
      row-gap: 0;
      margin-top: -128px;
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
        font-size: 48px;
        line-height: 3.5rem;
      }

      .artist {
        align-self: center;
      }

      .songs-quantity {
        align-self: flex-start;
      }

      .actions {
        justify-content: flex-start;
        align-self: flex-end;

        .context-menu {
          right: calc(100% - 240px);
        }
      }
    }
  }
}
</style>
