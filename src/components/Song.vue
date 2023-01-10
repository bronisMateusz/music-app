<template>
  <ul class="songs">
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
      <eva-icon
        class="options"
        name="more-horizontal-outline"
        height="28"
        width="28"
      />
    </li>
  </ul>
</template>

<script>
export default {
  props: ["songs"],
};
</script>

<style lang="scss">
.songs {
  @include songs-list;

  .song-details {
    @include song-details;
  }
}
</style>
