<template>
  <song :songs="songs" />
</template>

<script>
import { db } from "@/includes/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { mapState } from "pinia";
import Song from "@/components/Song.vue";
import useUserStore from "@/stores/user";

export default {
  data() {
    return {
      songs: [],
    };
  },
  components: { Song },
  async created() {
    await this.getSongs();
  },
  computed: {
    ...mapState(useUserStore, ["userId"]),
  },
  methods: {
    addSong(doc, favoriteSongs) {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
        // Check if the song id is favoriteSongs
        inFavorites: favoriteSongs.some((favSong) => favSong.id === doc.id),
      });
    },
    async getFavorites() {
      const favoritesRef = doc(db, "favorites", this.userId);
      const favoritesSnapshot = await getDoc(favoritesRef);

      // Get favorites songs
      return (favoritesSnapshot.data() && favoritesSnapshot.data().songs) || [];
    },

    async getSongs() {
      // Query songs collection and get first 7 documents
      const songsQuery = query(
        collection(db, "songs"),
        where("genre", "==", this.$route.params.name)
      );
      const songsSnap = await getDocs(songsQuery);

      // Get favorites
      const favoriteSongs = await this.getFavorites();
      songsSnap.forEach((doc) => this.addSong(doc, favoriteSongs));
    },
  },
};
</script>

<style lang="scss">
#genre {
  @include songs-list;

  .song-details {
    @include song-details;
  }
}
</style>
