<template>
  <div id="content">
    <!-- Latest albums -->
    <section id="latest-albums">
      <latest-albums :albums="albums" />
    </section>
    <!-- Genres -->
    <section id="genres">
      <h2>Genres</h2>
      <ul>
        <li v-for="genre in filteredGenres" :key="genre.name">
          <router-link :to="{ name: 'genre', params: { name: genre.name } }">
            {{ genre.name }}
          </router-link>
        </li>
      </ul>
      <router-link :to="{ name: 'all-genres' }">All genres</router-link>
    </section>
    <!-- Your playlists -->
    <section v-if="userLoggedIn" id="your-playlists">
      <h2>Your playlists</h2>
      <ul>
        <li>
          <a href="#">
            <aurora-gradient :variant="0" />
            <p>Top 100 Europa</p>
          </a>
        </li>
        <li>
          <a href="#">
            <aurora-gradient :variant="1" />
            <p>My playlist</p></a
          >
        </li>
      </ul>
      <a href="/all-genres">All playlists</a>
    </section>
    <!-- Newest songs -->
    <section id="newest-songs">
      <h2>Newest songs</h2>
      <song :songs="songs" />
    </section>
  </div>
</template>

<script>
import { db } from '@/includes/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { mapState } from 'pinia'

import AuroraGradient from '@/components/AuroraGradient.vue'
import LatestAlbums from '@/components/LatestAlbums.vue'
import Song from '@/components/Song.vue'

import useFavoritesStore from '@/stores/favorites'
import useUserStore from '@/stores/user'

export default {
  data() {
    return {
      albums: [],
      genres: [],
      songs: []
    }
  },
  components: { AuroraGradient, LatestAlbums, Song },
  async created() {
    await this.getLatestAlbums()
    await this.getLatestGenres()
    await this.getLatestSongs()
  },
  computed: {
    ...mapState(useUserStore, ['userId', 'userLoggedIn']),
    ...mapState(useFavoritesStore, ['favSongs']),

    filteredGenres() {
      // Don't return genres with empty name
      return this.genres.filter((genre) => genre.name)
    }
  },
  methods: {
    addAlbums(doc) {
      this.albums.push({
        ...doc.data(),
        id: doc.id
      })
    },

    addGenre(doc) {
      this.genres.push({
        ...doc.data()
      })
    },

    addSong(doc) {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
        // Check if the song id is favoriteSongs
        inFavorites: this.favSongs.some((favSong) => favSong.id === doc.id)
      })
    },

    async getLatestAlbums() {
      // Query genres collection and get first 7 documents
      const albumsQuery = query(collection(db, 'albums'), limit(4))
      const albumsSnap = await getDocs(albumsQuery)

      albumsSnap.forEach(this.addAlbums)
    },

    async getLatestGenres() {
      // Query genres collection and get first 7 documents
      const genresQuery = query(collection(db, 'genres'), limit(7))
      const genresSnap = await getDocs(genresQuery)

      genresSnap.forEach(this.addGenre)
    },

    async getLatestSongs() {
      // Query songs collection and get first 7 documents
      const songsQuery = query(collection(db, 'songs'), limit(7))
      const songsSnap = await getDocs(songsQuery)

      songsSnap.forEach(this.addSong)
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: $text-primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.hidden {
  display: none;
}

button {
  cursor: pointer;
  border-style: none;
  background-color: transparent;
  color: $text-secondary;
  font-family: 'Josefin Sans', sans-serif;

  &:hover,
  &.active {
    color: $text-primary;
  }
}

body {
  background-color: $color-canvas;
  color: $text-primary;
  font-weight: 500;
  font-family: 'Josefin Sans', sans-serif;

  @include scrollbar-styles;

  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    #content {
      display: grid;
      grid-template-columns: 100%;
      gap: 24px;
    }

    #latest-albums {
      width: calc(100% + 24px);
      overflow-x: scroll;
      @include hidden-scrollbar;

      ul {
        @include hidden-list-marks;
        display: flex;
        gap: 24px;

        .album {
          display: block;
          position: relative;
          width: 275px;
          height: 186px;

          section {
            display: flex;
            position: absolute;
            flex-direction: column-reverse;
            gap: 12px;
            inset: 0;
            border-radius: 20px;
            padding: 12px;
            color: $text-primary-inverted;

            h3 {
              margin: 0;
              font-size: 1.375rem;
              line-height: 1.375rem;
              overflow-wrap: break-word;
            }

            p {
              font-size: 0.75rem;
            }
          }
        }

        li:last-of-type a {
          margin-right: 24px;
        }
      }
    }

    #genres {
      ul {
        @include hidden-list-marks;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;

        li {
          flex: 1 1 auto;
          @include blurred-bg($color-element);
          border: 1px solid $color-border-primary;
          border-radius: 20px;

          a {
            display: block;
            padding: 16px 32px;
            width: 100%;
            text-align: center;
          }
        }
      }
      > a {
        @include btn-secondary;
        text-transform: capitalize;
      }
    }

    #your-playlists {
      width: calc(100% + 24px);

      ul {
        @include hidden-list-marks;
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        overflow: hidden;

        a {
          display: block;
          .aurora-gradient {
            margin-bottom: 8px;
            width: 200px;
            height: 200px;
          }
        }
      }

      > a {
        @include btn-secondary;
        margin-right: 24px;
        text-transform: capitalize;
      }
    }
  }

  @media (min-width: $lg) {
    #app {
      #content {
        display: grid;
        grid-template-columns: 412px auto;
      }

      #latest-albums {
        grid-column: 1/3;
        ul .album {
          width: 550px;
          height: 372px;

          section {
            gap: 24px;
            padding: 24px;

            h3 {
              font-size: 3rem;
              line-height: 3rem;
            }
            p {
              font-size: 1rem;
            }
          }
        }
      }

      #genres,
      #your-playlists {
        grid-column: 1;
      }

      #your-playlists {
        width: 100%;

        > a {
          margin-right: 0;
        }
      }

      #newest-songs {
        grid-row: 2/4;
        grid-column: 2;
      }
    }
  }

  @media (min-width: $xl) {
    #app {
      #content {
        grid-template-columns: 552px auto;
      }

      #your-playlists ul a .aurora-gradient {
        width: 270px;
        height: 270px;
      }
    }
  }
}
</style>
