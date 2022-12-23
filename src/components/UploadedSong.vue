<template>
  <li>
    <div class="song-details">
      <span class="song-cover" />
      <a href="#" class="song-title">Song Title</a>
      <span class="song-artist">Artist Name</span>
    </div>
    <button>
      <eva-icon name="more-horizontal-outline" height="28" width="28" />
    </button>
    <button>
      <eva-icon name="close-outline" height="28" width="28" />
    </button>
  </li>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
    };
  },
};
</script>
