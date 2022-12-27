<template>
  <li v-show="!showForm">
    <div class="song-details">
      <span class="song-cover" />
      <a href="#" class="song-title">{{ song.modified_name }}</a>
      <span class="song-artist">Artist Name</span>
    </div>
    <button @click.prevent="toggleFormVisibility">
      <eva-icon name="more-horizontal-outline" height="28" width="28" />
    </button>
    <button @click.prevent="deleteSong">
      <eva-icon name="close-outline" height="28" width="28" />
    </button>
  </li>
  <li v-show="showForm">
    <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
      <label>
        Song title
        <vee-field type="text" name="modified_name" placeholder="Title" />
        <ErrorMessage name="modified_name" />
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
import { db, storage } from "@/includes/firebase";
import { ref, deleteObject } from "firebase/storage";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";

export default {
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSongDetails: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required",
        genre: "alphaSpaces",
      },
    };
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),
    async edit(values) {
      const songsRef = doc(db, "songs", this.song.docId);
      try {
        await updateDoc(songsRef, values);
      } catch (error) {
        this.setNotification(
          "error",
          "Something went wrong",
          "We couldn't update song details"
        );
        return;
      }

      this.updateSongDetails(this.index, values);

      this.setNotification("success", "Success!", "Song details updated");
      this.toggleFormVisibility();
    },
    toggleFormVisibility() {
      this.showForm = !this.showForm;
    },
    async deleteSong() {
      const songRef = ref(storage, `songs/${this.song.original_name}`);
      await deleteObject(songRef)
        .then(() => {
          this.setNotification("success", "Success!", "Song has been removed");
        })
        .catch(() => {
          this.setNotification(
            "error",
            "Something went wrong",
            "We couldn't update song details"
          );
          return;
        });
      await deleteDoc(doc(db, "songs", this.song.docId));
      this.removeSong(this.index);
    },
  },
};
</script>
