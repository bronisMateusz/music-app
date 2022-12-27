<template>
  <section>
    <ul id="latest-albums">
      <li>
        <article class="album">
          <aurora-gradient />
          <section>
            <h2>₪₪₪ MadeHewraGreatForever ₪₪₪</h2>
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
            <h2>Cock.0z Mixtape</h2>
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
            <h2>Mobbyn</h2>
            <p>New Album by <strong>Mobbyn</strong></p>
          </section>
        </article>
      </li>
    </ul>
  </section>
  <section>
    <h2>Songs</h2>
    <!-- Playlist -->
    <ul id="playlist">
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
      display: flex;
      gap: 24px;
      list-style: none;
      padding: 0;

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

          h2 {
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

    #playlist {
      @include songs-list;

      .song-details {
        @include song-details(2);
      }
    }
  }

  @media (min-width: 992px) {
    #app #latest-albums .album {
      height: 372px;
      width: 550px;

      section {
        gap: 24px;
        padding: 24px;
        
        h2 {
          font-size: 3rem;
          line-height: 3rem;
        }
        p {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
