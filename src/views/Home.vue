<template>
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
      <li>
        <button>Hip-hop</button>
      </li>
      <li>
        <button>Rock</button>
      </li>
      <li>
        <button>Alternative</button>
      </li>
      <li>
        <button>Electronica</button>
      </li>
      <li>
        <button>Hard Rock</button>
      </li>
      <li>
        <button>Lo-Fi</button>
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
  <!-- Songs -->
  <section id="playlist">
    <h2>Songs</h2>
    <!-- Playlist -->
    <ul>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
    </ul>
    <!-- .. end Playlist -->
  </section>
</template>

<script>
import AuroraGradient from "@/components/AuroraGradient.vue";
export default {
  components: { AuroraGradient },
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

  &:hover {
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
          @include blurred-bg;
          border: 1px solid $color-border-primary;
          border-radius: 20px;
        }

        button {
          padding: 16px 32px;
          width: 100%;
        }
      }
      a {
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
        text-transform: capitalize;
      }
    }

    #playlist ul {
      @include songs-list;

      .song-details {
        @include song-details(2);
      }
    }
  }

  @media (min-width: 992px) {
    #app {
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
      }

      #playlist {
        grid-column: 2;
        grid-row: 2/4;
      }
    }
  }

  @media (min-width: 1200px) {
    #app #your-playlists ul a .aurora-gradient {
      width: 270px;
      height: 270px;
    }
  }
}
</style>
