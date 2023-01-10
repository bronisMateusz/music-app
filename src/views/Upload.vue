<template>
  <!-- Upload -->
  <section>
    <h2>Upload</h2>
    <div
      id="drop-zone"
      @dragend.prevent.stop="isDragover = false"
      @dragover.prevent.stop="isDragover = true"
      @dragenter.prevent.stop="isDragover = true"
      @dragleave.prevent.stop="isDragover = false"
      @drop.prevent.stop="upload($event)"
    >
      <div>
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
        <p v-if="!isDragover">
          Drop your file(s) here or
          <label for="files-input">browse</label>
          <input
            id="files-input"
            class="hidden"
            type="file"
            multiple
            @change="upload($event)"
          />
        </p>
        <p v-else>Drop your file(s) to upload</p>
        <span>Maximum file size is 25 MB</span>
      </div>
    </div>
  </section>
  <!-- Upload progress -->
  <section v-if="uploads.length">
    <h2>Upload progress</h2>
    <ul id="upload-progress">
      <li v-for="upload in uploads" :key="upload.title">
        <div
          class="song-cover"
          :style="{
            'background-image': upload.picture
              ? `url(${upload.picture})`
              : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
          }"
        />
        <div class="song-details" :class="upload.variant">
          <p class="song-title">{{ upload.title }}</p>
          <span class="song-artist">{{ upload.artist }}</span>
          <!-- Progress bar -->
          <div class="progress-bar">
            <div class="bar">
              <label for="upload-progress" class="hidden">
                Upload progress
              </label>
              <input
                id="upload-progress"
                v-model="upload.current_progress"
                type="range"
                :style="{
                  'background-size': `${upload.current_progress}% 100%`,
                }"
                disabled
              />
              <div class="bar-bg"></div>
            </div>
            <span v-if="upload.variant === 'error'" class="progress-value">
              error
            </span>
            <span v-else class="progress-value">
              {{ upload.current_progress }}&nbsp;%
            </span>
          </div>
        </div>
        <button title="Cancel upload" @click.prevent="cancelUpload">
          <eva-icon name="close-outline" height="28" width="28" />
        </button>
      </li>
    </ul>
  </section>
  <!-- Uploaded albums -->
  <section>
    <h2>Uploaded albums</h2>
    <ul id="uploaded-albums"></ul>
  </section>
  <!-- Uploaded songs -->
  <section v-if="songs.length">
    <h2>Uploaded songs</h2>
    <ul id="uploaded-songs">
      <song-uploaded
        v-for="(song, index) in songs"
        :key="song.id"
        :song="song"
        :updateSongDetails="updateSongDetails"
        :index="index"
        :removeSong="removeSong"
        :updateUnsavedFlag="updateUnsavedFlag"
      />
    </ul>
  </section>
</template>
<script>
import { auth, db, storage } from "@/includes/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";
import SongUploaded from "@/components/SongUploaded.vue";
import jsmediatags from "jsmediatags";

export default {
  components: { SongUploaded },
  data() {
    return {
      isDragover: false,
      songs: [],
      unsavedFlag: false,
      uploads: [],
    };
  },
  async created() {
    // Get list of user songs
    const q = query(
      collection(db, "songs"),
      where("user_id", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(this.addSong);
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),

    async upload($event) {
      this.isDragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "audio/mpeg") return;

        // Get file metadata
        const metadata = await this.getMetadata(file);

        // Create song ref
        const songRef = ref(
          storage,
          `songs/${auth.currentUser.uid}/${file.name}`
        );

        //Upload song to Storage
        const task = uploadBytesResumable(songRef, file, metadata);

        const uploadIndex =
          this.uploads.push({
            artist: metadata.artist,
            current_progress: 0,
            picture: metadata.picture,
            task,
            title: metadata.title,
            variant: "",
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.ceil(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.uploads[uploadIndex].current_progress = progress;
          },
          () => {
            this.uploads[uploadIndex].variant = "error";
            this.setNotification(
              "error",
              "Something went wrong",
              "We couldn't upload your files"
            );
          },
          async () => {
            const song = {
              ...metadata,
              artist_id: await this.getDocId("artists", metadata.artist),
              file_name: file.name,
              genre_id: await this.getDocId("genres", metadata.genre),
              user_id: auth.currentUser.uid,
              url: await getDownloadURL(task.snapshot.ref),
            };
            const songRef = await addDoc(collection(db, "songs"), song);
            const songSnapshot = await getDoc(songRef);

            this.addSong(songSnapshot);
            this.updateAlbumDoc(metadata, songSnapshot);

            this.setNotification(
              "success",
              "Success!",
              "Your files just landed on the server"
            );
          }
        );
      }
    },

    async getDocId(collectionName, name) {
      const q = query(
        collection(db, collectionName),
        where("name", "==", name)
      );

      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      if (doc) {
        return doc.id;
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          name: name,
        });
        return docRef;
      }
    },

    async updateAlbumDoc(metadata, songSnapshot) {
      const albumsQuery = query(
        collection(db, "albums"),
        where("artist", "==", metadata.artist),
        where("name", "==", metadata.album)
      );

      const albumsSnapshot = await getDocs(albumsQuery);
      const albumDoc = albumsSnapshot.docs[0];

      if (albumDoc) {
        await updateDoc(doc(db, "albums", albumDoc.id), {
          songs: arrayUnion({ id: songSnapshot.id }),
        });
      } else {
        await addDoc(collection(db, "albums"), {
          artist: metadata.artist,
          format: metadata.format,
          name: metadata.album,
          picture: metadata.picture,
          songs: [{ id: songSnapshot.id }],
        });
      }
    },

    async getMetadata(file) {
      return new Promise((resolve, reject) => {
        jsmediatags.read(file, {
          onSuccess: (tag) => {
            const metadata = tag.tags;

            // Convert image data to JPEG file
            const pictureBase64 = metadata.picture.data
              .map((charCode) => String.fromCharCode(charCode))
              .join("");
            const pictureData = `data:${
              metadata.picture.format
            };base64,${window.btoa(pictureBase64)}`;

            // Convert TPOS to disc info
            const tposData = metadata.TPOS.data.split("/");

            // Convert track to track info
            const trackData = metadata.track.split("/");

            // If year is store in TDRC, get only year
            // else get just year
            const yearData = metadata.TDRC
              ? metadata.TDRC.data.slice(0, 4)
              : metadata.year;

            resolve({
              album: metadata.album,
              artist: metadata.artist,
              author: metadata.TCOM.data,
              disc: tposData[0],
              discTotal: tposData[1],
              format: metadata.picture.format,
              genre: metadata.genre,
              lyrics: "",
              picture: pictureData,
              title: metadata.title,
              track: trackData[0],
              trackTotal: trackData[1],
              year: yearData,
            });
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
    },

    cancelUpload() {
      this.uploads.forEach((upload) => upload.task.cancel());
    },

    updateSongDetails(index, values) {
      this.songs[index].album = values.album;
      this.songs[index].artist = values.artist;
      this.songs[index].author = values.author;
      this.songs[index].disc = values.disc;
      this.songs[index].discTotal = values.discTotal;
      this.songs[index].format = values.format;
      this.songs[index].genre = values.genre;
      this.songs[index].lyrics = values.lyrics;
      this.songs[index].picture = values.picture;
      this.songs[index].title = values.title;
      this.songs[index].track = values.track;
      this.songs[index].trackTotal = values.trackTotal;
      this.songs[index].year = values.year;
    },

    removeSong(index) {
      this.songs.splice(index, 1);
    },

    addSong(doc) {
      const song = {
        ...doc.data(),
        id: doc.id,
      };
      this.songs.push(song);
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeUnmount() {
    this.cancelUpload();
  },
  beforeRouteLeave(to, from, next) {
    !this.unsavedFlag
      ? next()
      : this.setNotification(
          "notice",
          "Unsaved changes",
          "Save or discard changes to song details"
        );
  },
};
</script>

<style lang="scss">
#drop-zone {
  @include blurred-bg($color-element);
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='%2356504D' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 254px;
  justify-content: center;
  padding: 36px;
  text-align: center;

  svg,
  span {
    color: $text-secondary;
  }

  svg {
    margin-bottom: 36px;
  }

  p {
    font-size: 1.375rem;
    margin-bottom: 12px;

    label {
      color: $text-success;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

#upload-progress {
  @include songs-list;

  .song-details {
    @include song-details;
  }
}

#upload-progress {
  .song-details {
    &.error {
      .song-title,
      .song-artist,
      .progress-bar {
        color: $text-error;
      }

      .progress-bar .bar input {
        background-image: linear-gradient($text-error, $text-error);
      }
    }

    .progress-bar {
      @include progress-bar;

      .bar input {
        cursor: default;
      }

      .progress-value {
        text-align: right;
      }
    }
  }
}
</style>
