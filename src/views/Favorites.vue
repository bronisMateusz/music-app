<template>
  <div v-if="songs.length || albums.length" id="favorites">
    <!-- Uploaded albums -->
    <section v-if="albums.length">
      <h2>Favorites albums</h2>
      <ul id="favorites-albums">
        <li v-for="album in albums" :key="album.name">
          <router-link :to="{ name: 'album', params: { id: album.id } }">
            <div
              class="album-cover"
              :style="{
                'background-image': album.picture
                  ? `url(${album.picture})`
                  : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)'
              }"
            />
            <p>{{ album.name }}</p>
          </router-link>
        </li>
      </ul>
    </section>
    <!-- Uploaded albums -->
    <section v-if="songs.length">
      <h2>Favorites songs</h2>
      <song :songs="songs" />
    </section>
  </div>
  <div v-else>
    <h2>You haven't any favorites yet. :(</h2>
  </div>
</template>

<script>
import { db } from '@/includes/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { mapActions, mapState, mapWritableState } from 'pinia'

import Song from '@/components/Song.vue'

import usePlayerStore from '@/stores/player'
import useUserStore from '@/stores/user'

export default {
  data() {
    return {
      albums: [],
      songs: []
    }
  },
  async created() {
    if (!this.userLoggedIn) {
      this.$router.push({ name: 'home' })
      return
    }
    // Get favorites doc
    const favoritesRef = doc(db, 'favorites', this.userId)
    const favoritesSnapshot = await getDoc(favoritesRef)

    // Get favorites albums
    const favoriteAlbums = (favoritesSnapshot.data() && favoritesSnapshot.data().albums) || []

    // Get favorites songs
    const favoriteSongs = (favoritesSnapshot.data() && favoritesSnapshot.data().songs) || []

    // Retrieve favorites albums
    for (let i = 0; i < favoriteAlbums.length; i++) {
      const albumRef = doc(db, 'albums', favoriteAlbums[i].id)
      const albumSnap = await getDoc(albumRef)
      this.addToArray(albumSnap, favoriteSongs, this.albums)
    }
    // Retrieve favorites songs
    for (let i = 0; i < favoriteSongs.length; i++) {
      const songRef = doc(db, 'songs', favoriteSongs[i].id)
      const songSnap = await getDoc(songRef)
      this.addToArray(songSnap, favoriteSongs, this.songs)
    }
  },
  components: { Song },
  computed: {
    ...mapState(useUserStore, ['userId', 'userLoggedIn']),
    ...mapWritableState(usePlayerStore, [
      'currentSong',
      'currentSongIndex',
      'playing',
      'songsQueue'
    ])
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),

    addToArray(doc, favoriteItems, array) {
      const item = {
        ...doc.data(),
        id: doc.id,
        // Check if the item id is in favoriteItems
        inFavorites: favoriteItems.some((favItem) => favItem.id === doc.id)
      }
      array.push(item)
    }
  }
}
</script>

<style lang="scss">
#favorites {
  display: flex;
  flex-direction: column;
  gap: 36px;
}
#favorites-albums {
  @include albums-list;
}
</style>
