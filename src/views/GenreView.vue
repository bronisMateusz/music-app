<template>
  <songs-list :songs="songs" />
</template>

<script>
import { db } from '@/includes/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { mapState } from 'pinia'
import SongsList from '@/components/SongsList.vue'
import useFavoritesStore from '@/stores/favorites'
import useUserStore from '@/stores/user'

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
    ...mapState(useUserStore, ['userId']),
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
      // Query songs collection and get first 7 documents
      const songsQuery = query(
        collection(db, 'songs'),
        where('genre', '==', this.$route.params.name)
      )
      const songsSnap = await getDocs(songsQuery)

      songsSnap.forEach(this.addSong)
    }
  }
}
</script>

<style lang="scss">
#genre {
  @include songs-list;

  .song-details {
    @include song-details;
  }
}
</style>
