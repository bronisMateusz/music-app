<template>
  <li v-show="!showForm">
    <div class="song-details">
      <span class="song-cover" />
      <a href="#" class="song-title">Song Title</a>
      <span class="song-artist">Artist Name</span>
    </div>
    <button @click.prevent="toggleFormVisibility">
      <eva-icon name="more-horizontal-outline" height="28" width="28" />
    </button>
    <button>
      <eva-icon name="close-outline" height="28" width="28" />
    </button>
  </li>
  <li v-show="showForm">
    <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
      <label>
        Song title
        <vee-field type="text" name="title" placeholder="Title" />
        <ErrorMessage name="title" />
      </label>
      <label>
        Genre
        <vee-field type="text" name="genre" placeholder="Genre" />
        <ErrorMessage name="genre" />
      </label>
      <button type="submit">Submit</button>
      <button @click.prevent="toggleFormVisibility">Cancel</button>
    </vee-form>
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
      schema: {
        title: "required",
        genre: "alphaSpaces",
      },
    };
  },
  methods: {
    edit() {
      console.log("edited");
    },
    toggleFormVisibility() {
      this.showForm = !this.showForm;
    },
  },
};
</script>
