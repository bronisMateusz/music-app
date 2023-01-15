<template>
  <div id="content">
    <!-- Latest albums -->
    <section id="latest-albums">
      <ul>
        <li>
          <article class="album">
            <aurora-gradient />
            <section>
              <h3>₪₪₪ MadeHewraGreatForever ₪₪₪</h3>
              <p>New Album by <strong>HEWRA</strong></p>
            </section>
          </article>
        </li>
        <li>
          <article class="album">
            <aurora-gradient
              colorFirst="#FF6A37"
              colorSecond="#FFD31F"
              colorThird="#FF3969"
              colorFourth="#FF2528"
            />
            <section>
              <h3>Cock.0z Mixtape</h3>
              <p>New Album by <strong>Kaz Bałagane</strong></p>
            </section>
          </article>
        </li>
        <li>
          <article class="album">
            <aurora-gradient
              colorFirst="#BBC0FF"
              colorSecond="#00DDFF"
              colorThird="#79E9FF"
              colorFourth="#327DF6"
            />
            <section>
              <h3>Mobbyn</h3>
              <p>New Album by <strong>Mobbyn</strong></p>
            </section>
          </article>
        </li>
      </ul>
    </section>
    <!-- Genres -->
    <section id="genres">
      <h2>Genres</h2>
      <ul>
        <li v-for="genre in genres" :key="genre.name">
          <router-link :to="{ name: 'genre', params: { name: genre.name } }">
            {{ genre.name }}
          </router-link>
        </li>
      </ul>
      <a href="/all-genres">All genres</a>
    </section>
    <!-- Your playlists -->
    <section id="your-playlists">
      <h2>Your playlists</h2>
      <ul>
        <li>
          <a href="#">
            <aurora-gradient />
            <p>Top 100 Europa</p>
          </a>
        </li>
        <li>
          <a href="#">
            <aurora-gradient
              colorFirst="#FF6A37"
              colorSecond="#FFD31F"
              colorThird="#FF3969"
              colorFourth="#FF2528"
            />
            <p>Diho - essentials</p></a
          >
        </li>
      </ul>
      <a href="/all-genres">All playlists</a>
    </section>
    <!-- Newest songs -->
    <section id="newest-songs">
      <h2>Newest songs</h2>
      <!-- Playlist -->
      <song :songs="songs" />
      <!-- .. end Playlist -->
    </section>
  </div>
</template>

<script>
import AuroraGradient from "@/components/AuroraGradient.vue";
import Song from "@/components/Song.vue";
import { db } from "@/includes/firebase";
import { collection, query, getDocs, limit } from "firebase/firestore";
export default {
  data() {
    return {
      genres: [],
      songs: [],
    };
  },
  components: { AuroraGradient, Song },
  async created() {
    const songsQuery = query(collection(db, "songs"), limit(7));
    const songsSnap = await getDocs(songsQuery);
    songsSnap.forEach((doc) => {
      this.songs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const genreQuery = query(collection(db, "genres"), limit(7));
    const genreSnap = await getDocs(genreQuery);
    genreSnap.forEach((doc) => {
      this.genres.push({
        ...doc.data(),
      });
    });
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  box-sizing: border-box;
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
  background-color: transparent;
  border-style: none;
  cursor: pointer;
  color: $text-secondary;
  font-family: "Josefin Sans", sans-serif;

  &:hover,
  &.active {
    color: $text-primary;
  }
}

body {
  background-color: $color-canvas;
  color: $text-primary;
  font-family: "Josefin Sans", sans-serif;
  font-weight: 500;

  @include scrollbar-styles;

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    #content {
      display: grid;
      gap: 24px;
      grid-template-columns: 100%;
    }

    #latest-albums {
      overflow-x: hidden;
      width: calc(100% + 24px);

      ul {
        @include hidden-list-marks;
        display: flex;
        gap: 24px;

        .album {
          height: 186px;
          width: 275px;
          position: relative;

          section {
            border-radius: 20px;
            color: $text-primary-inverted;
            display: flex;
            flex-direction: column-reverse;
            gap: 12px;
            inset: 0;
            padding: 12px;
            position: absolute;

            h3 {
              font-size: 1.375rem;
              line-height: 1.375rem;
              margin: 0;
              overflow-wrap: break-word;
            }

            p {
              font-size: 0.75rem;
            }
          }
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
            text-align: center;
            width: 100%;
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
            height: 200px;
            margin-bottom: 8px;
            width: 200px;
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

  @media (min-width: 992px) {
    #app {
      #content {
        display: grid;
        grid-template-columns: 412px auto;
      }

      #latest-albums {
        grid-column: 1/3;
        ul .album {
          height: 372px;
          width: 550px;

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
        grid-column: 2;
        grid-row: 2/4;
      }
    }
  }

  @media (min-width: 1200px) {
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
