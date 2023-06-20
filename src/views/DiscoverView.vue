<template>
  <songs-list :songs="songs" />
</template>

<script>
import { db } from '@/includes/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import { mapState } from 'pinia'

import SongsList from '@/components/SongsList.vue'
import useFavoritesStore from '@/stores/favorites'
export default {
  data() {
    return {
      songs: []
    }
  },
  components: { SongsList },
  async created() {
    await this.getSongs()
  },
  computed: {
    ...mapState(useFavoritesStore, ['favSongs'])
  },
  methods: {
    addSong(doc) {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
        // Check if the song id is favoriteSongs
        inFavorites: this.favSongs.some((favSong) => favSong.id === doc.id)
      })
    },
    async getSongs() {
      const songsQuery = query(collection(db, 'songs'))
      const songsSnap = await getDocs(songsQuery)

      songsSnap.forEach(this.addSong)
    }
  }
}
</script>
