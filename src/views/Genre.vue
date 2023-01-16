<template>
  <ul id="genre">
    <li v-for="song in songs" :key="song.id">
      <div
        class="song-cover"
        :style="{
          'background-image': song.picture
            ? `url(${song.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
        }"
      />
      <div class="song-details">
        <router-link
          :to="{ name: 'song', params: { id: song.id } }"
          class="song-title"
        >
          {{ song.title }}
        </router-link>
        <span class="song-artist">{{ song.artist }}</span>
      </div>
      <eva-icon name="more-horizontal-outline" height="28" width="28" />
    </li>
  </ul>
</template>

<script>
import { db } from "@/includes/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default {
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    const songsQuery = query(
      collection(db, "songs"),
      where("genre", "==", this.$route.params.name)
    );
    const songsSnap = await getDocs(songsQuery);

    if (!songsSnap.docs.length) {
      this.$router.push({ name: "home" });
      return;
    }

    songsSnap.forEach((doc) => {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
      });
    });
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
