<template>
  <!-- Upload -->
  <section>
    <h2>Upload</h2>
    <div
      id="drop-zone"
      @dragend.prevent.stop="is_dragover = false"
      @dragover.prevent.stop="is_dragover = true"
      @dragenter.prevent.stop="is_dragover = true"
      @dragleave.prevent.stop="is_dragover = false"
      @drop.prevent.stop="upload($event)"
    >
      <div v-if="!is_dragover">
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
        <p>
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
        <span>Maximum file size is 25 MB</span>
      </div>
      <div v-else>
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
        <p>Drop your file(s) to upload</p>
      </div>
    </div>
  </section>
  <!-- Upload progress -->
  <section v-show="uploads.length">
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
  <section class="hidden">
    <h2>Uploaded albums</h2>
  </section>
  <!-- Uploaded songs -->
  <section v-show="songs.length">
    <h2>Uploaded songs</h2>
    <ul id="uploaded-songs">
      <song-uploaded
        v-for="(song, index) in songs"
        :key="song.docId"
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
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";
import SongUploaded from "@/components/SongUploaded.vue";
import jsmediatags from "jsmediatags";

export default {
  components: { SongUploaded },
  data() {
    return {
      is_dragover: false,
      songs: [],
      unsavedFlag: false,
      uploads: [],
    };
  },
  async created() {
    // Get list of user songs
    const q = query(
      collection(db, "songs"),
      where("uid", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(this.addSong);
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),
    async upload($event) {
      this.is_dragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "audio/mpeg") return;

        // Get file metadata
        const metadata = await this.getMetadata(file);

        // Create song ref
        const songRef = ref(storage, `songs/${file.name}`);

        //Upload song to Firestore Database
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
              uid: auth.currentUser.uid,
              url: await getDownloadURL(task.snapshot.ref),
            };
            const songRef = await addDoc(collection(db, "songs"), song);
            const songSnapshot = await getDoc(songRef);
            this.addSong(songSnapshot);

            this.setNotification(
              "success",
              "Success!",
              "Your files just landed on the server"
            );
          }
        );
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

            // Convert TDC to year
            const TDRC = metadata.TDRC.data;
            const yearData = TDRC.slice(0, 4);

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
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
        docId: doc.id,
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
  @include blurred-bg;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='%2356504D' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 20px;
  height: 254px;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
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
