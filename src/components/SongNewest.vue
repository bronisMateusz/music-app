<template>
  <li>
    <div class="song-details">
      <span class="song-cover" />
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
        class="song-title"
      >
        {{ song.modified_name }}
      </router-link>
      <span class="song-artist">{{ song.display_name }}</span>
    </div>
    <eva-icon
      class="options"
      name="more-horizontal-outline"
      height="28"
      width="28"
    />
  </li>
</template>

<script>
export default {
  props: ["song"],
};
</script>
