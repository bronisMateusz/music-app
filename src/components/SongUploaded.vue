<template>
  <li v-if="!showForm">
    <div
      class="song-cover"
      :style="{
        'background-image': song.picture
          ? `url(${song.picture})`
          : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
      }"
      @click.prevent="newSong(song)"
    />
    <div class="song-details" @click.prevent="newSong(song)">
      <button class="song-title">
        {{ song.title }}
      </button>
      <span class="song-artist">{{ song.artist }}</span>
    </div>
    <button @click.prevent="toggleFormVisibility">
      <eva-icon name="more-horizontal-outline" height="28" width="28" />
    </button>
    <button @click.prevent="deleteSong">
      <eva-icon name="close-outline" height="28" width="28" />
    </button>
  </li>
  <li v-else>
    <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
      <div class="song-cover-wrapper">
        <div
          class="song-cover"
          :style="{
            'background-image': song.picture
              ? `url(${song.picture})`
              : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
          @dragend.prevent.stop="isDragover = false"
          @dragover.prevent.stop="isDragover = true"
          @dragenter.prevent.stop="isDragover = true"
          @dragleave.prevent.stop="isDragover = false"
          @drop.prevent.stop="updateCover($event)"
        >
          <label v-if="!isDragover" for="file-input">browse</label>
          <label v-else for="file-input" class="dragover">
            <eva-icon name="cloud-upload-outline" height="72" width="72" />
          </label>
          <input
            id="file-input"
            class="hidden"
            type="file"
            @change="updateCover($event)"
          />
        </div>
        <div class="song-cover-info">
          <p>Image guidelines</p>
          <ul>
            <li><p>Square, at least 800x800px.</p></li>
            <li><p>File formats: JPEG or PNG.</p></li>
          </ul>
        </div>
      </div>
      <div>
        <label>
          Title
          <vee-field
            type="text"
            name="title"
            placeholder="Enter title"
            @input="updateUnsavedFlag(true)"
          />
        </label>
        <ErrorMessage name="title" />
      </div>
      <div>
        <label>
          Artist
          <vee-field
            type="text"
            name="artist"
            placeholder="Enter artist"
            @input="updateUnsavedFlag(true)"
          />
        </label>
        <ErrorMessage name="artist" />
      </div>
      <div>
        <label>
          Album
          <vee-field
            type="text"
            name="album"
            placeholder="Enter album name"
            @input="updateUnsavedFlag(true)"
          />
        </label>
        <ErrorMessage name="album" />
      </div>
      <div>
        <label>
          Author
          <vee-field
            type="text"
            name="author"
            placeholder="Enter author"
            @input="updateUnsavedFlag(true)"
          />
        </label>
        <ErrorMessage name="artist" />
      </div>
      <div>
        <label>
          Genre
          <vee-field
            type="text"
            name="genre"
            placeholder="Enter genre"
            @input="updateUnsavedFlag(true)"
          />
        </label>
        <ErrorMessage name="genre" />
      </div>
      <div>
        <label>
          Year
          <vee-field
            type="number"
            name="year"
            placeholder="Enter year"
            @input="updateUnsavedFlag(true)"
          />
        </label>
      </div>
      <div>
        <label>
          Track
          <vee-field
            type="number"
            name="track"
            placeholder="0"
            @input="updateUnsavedFlag(true)"
          />
        </label>
      </div>
      <div>
        <label>
          From
          <vee-field
            type="number"
            name="trackTotal"
            placeholder="0"
            @input="updateUnsavedFlag(true)"
          />
        </label>
      </div>
      <div>
        <label>
          Disc number
          <vee-field
            type="number"
            name="disc"
            placeholder="0"
            @input="updateUnsavedFlag(true)"
          />
        </label>
      </div>
      <div>
        <label>
          From
          <vee-field
            type="number"
            name="discTotal"
            placeholder="0"
            @input="updateUnsavedFlag(true)"
          />
        </label>
      </div>
      <div>
        <label>
          Lyrics
          <vee-field v-slot="{ field }" name="lyrics">
            <textarea
              v-bind="field"
              placeholder="Enter lyrics"
              rows="1"
              @input="updateUnsavedFlag(true)"
            />
          </vee-field>
        </label>
      </div>
      <div class="form-group">
        <button @click.prevent="toggleFormVisibility">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </vee-form>
  </li>
</template>

<script>
import { auth, db, storage } from "@/includes/firebase";
import { ref, deleteObject } from "firebase/storage";
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";
import usePlayerStore from "@/stores/player";

export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    song: {
      type: Object,
      required: true,
    },
    removeAlbum: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateAlbumPicture: {
      type: Function,
      required: true,
    },
    updateSongDetails: {
      type: Function,
      required: true,
    },
    updateSongPicture: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      isDragover: false,
      showForm: false,
      schema: {
        title: "required",
        artist: "required",
        album: "required",
        genre: "required|min:3|max:100|alphaSpaces",
      },
    };
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),
    ...mapActions(usePlayerStore, ["newSong"]),

    async deleteSong() {
      this.setNotification("notice", "Please wait", "We're removing this song");

      try {
        const songRef = ref(
          storage,
          `songs/${auth.currentUser.uid}/${this.song.file_name}`
        );

        // Delete song from Storage
        await deleteObject(songRef);

        // Delete song from Firestore
        await deleteDoc(doc(db, "songs", this.song.id));

        // Remove the song from the album's songs array
        const albumRef = doc(db, "albums", this.song.album_id);
        const albumSnap = await getDoc(albumRef);
        let data = albumSnap.data();
        data.songs = data.songs.filter((song) => song.id !== this.song.id);

        // If any song left in album, update album doc, else remove whole album doc
        if (data.songs.length) {
          await updateDoc(albumRef, data);
        } else {
          await deleteDoc(doc(db, "albums", this.song.album_id));
          this.removeAlbum(this.song.album_id);
        }

        this.removeSong(this.index);
        this.setNotification("success", "Success!", "Song has been removed");
      } catch (error) {
        this.setNotification(
          "error",
          "Something went wrong",
          "We couldn't remove this song"
        );
      }
    },

    async edit(values) {
      const songsRef = doc(db, "songs", this.song.id);
      try {
        await updateDoc(songsRef, {
          album: values.album,
          artist: values.artist,
          author: values.author,
          disc: values.disc,
          discTotal: values.discTotal,
          format: values.format,
          genre: values.genre,
          lyrics: values.lyrics,
          title: values.title,
          track: values.track,
          trackTotal: values.trackTotal,
          year: values.year,
        });
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

    async getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    toggleFormVisibility() {
      this.showForm = !this.showForm;
      this.updateUnsavedFlag(false);
    },

    async updateCover(event) {
      this.isDragover = false;
      this.setNotification("notice", "Please wait", "We're updating cover...");

      const file = event.dataTransfer
        ? [...event.dataTransfer.files][0]
        : [...event.target.files][0];

      if (file.type !== "image/jpeg") return;

      try {
        const pictureBase64 = await this.getBase64(file);

        const songsQuery = query(
          collection(db, "songs"),
          where("album_id", "==", this.song.album_id)
        );
        const songsSnapshot = await getDocs(songsQuery);

        // Update picture of all songs in album
        const songsPromises = songsSnapshot.docs.map(async (doc) => {
          await updateDoc(doc.ref, {
            format: "image/jpeg",
            picture: pictureBase64,
          });
          this.updateSongPicture(doc.id, pictureBase64);
        });

        // Wait for all songs update to complete
        await Promise.all(songsPromises);

        // Update album picture
        await updateDoc(doc(db, "albums", this.song.album_id), {
          picture: pictureBase64,
        });
        this.updateAlbumPicture(this.song.album_id, pictureBase64);

        this.setNotification("success", "Success", "Cover updated!");
      } catch (error) {
        this.setNotification(
          "error",
          "Something went wrong",
          "We couldn't update cover"
        );
      }
    },
  },
};
</script>

<style lang="scss">
#uploaded-songs {
  @include songs-list;

  .song-details {
    @include song-details;
  }

  form {
    display: grid;
    column-gap: 12px;
    row-gap: 8px;
    width: 100%;

    .song-cover-wrapper {
      display: grid;
      gap: 12px;
      grid-template-columns: auto 1fr;
      margin-bottom: 12px;

      .song-cover label {
        align-items: center;
        border-radius: 15px;
        color: transparent;
        cursor: pointer;
        display: flex;
        height: 70px;
        justify-content: center;
        width: 70px;

        &.dragover {
          background-color: rgba($text-primary, 0.9);
          color: $text-primary-inverted;
        }
      }

      .song-cover-info {
        align-self: center;

        ul {
          color: $text-secondary;
          list-style: disc;
          margin-top: 8px;
          padding-left: 16px;

          li p {
            line-height: 1rem;
            font-size: 0.75rem;
          }
        }
      }
    }

    > div:not(.song-cover-wrapper):not(.form-group) {
      @include form-element;
      @include form-element-error;

      label textarea {
        margin-bottom: 12px;
      }
    }

    .form-group {
      display: flex;
      justify-content: flex-end;
    }

    @media (min-width: 767px) {
      grid-template-columns: 1fr 1fr;

      .song-cover-wrapper,
      div:nth-of-type(12) {
        grid-column: 1/3;

        .song-cover,
        .song-cover label {
          height: 124px;
          width: 124px;
        }
      }

      .form-group {
        grid-column: 2;
      }
    }
  }
}
</style>
