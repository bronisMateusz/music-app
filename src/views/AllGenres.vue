<template>
  <div id="genres">
    <ul>
      <li v-for="genre in filteredGenres" :key="genre.name">
        <router-link :to="{ name: 'genre', params: { name: genre.name } }">
          {{ genre.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "@/includes/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
export default {
  data() {
    return {
      genres: [],
    };
  },
  async created() {
    await this.getGenres();
  },
  computed: {
    filteredGenres() {
      // Don't return genres with empty name
      return this.genres.filter((genre) => genre.name);
    },
  },
  methods: {
    addGenre(doc) {
      this.genres.push({
        ...doc.data(),
      });
    },
    async getGenres() {
      const genresQuery = query(collection(db, "genres"));
      const genresSnap = await getDocs(genresQuery);

      genresSnap.forEach(this.addGenre);
    },
  },
};
</script>
