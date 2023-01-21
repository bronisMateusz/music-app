<template>
  <div id="upload">
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
    <section v-if="albums.length">
      <h2>Uploaded albums</h2>
      <ul id="uploaded-albums">
        <li v-for="album in albums" :key="album.name">
          <router-link :to="{ name: 'album', params: { id: album.id } }">
            <div
              class="album-cover"
              :style="{
                'background-image': album.picture
                  ? `url(${album.picture})`
                  : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)',
              }"
            />
            <p>{{ album.name }}</p>
          </router-link>
        </li>
      </ul>
    </section>
    <!-- Uploaded songs -->
    <section v-if="songs.length">
      <h2>Uploaded songs</h2>
      <ul id="uploaded-songs">
        <song-uploaded
          v-for="(song, index) in songs"
          :key="song.id"
          :index="index"
          :removeAlbum="removeAlbum"
          :removeSong="removeSong"
          :song="song"
          :updateAlbumPicture="updateAlbumPicture"
          :updateSongDetails="updateSongDetails"
          :updateSongPicture="updateSongPicture"
          :updateUnsavedFlag="updateUnsavedFlag"
        />
      </ul>
    </section>
  </div>
</template>
<script>
import jsmediatags from "jsmediatags";
import { db, storage } from "@/includes/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { mapActions, mapState } from "pinia";
import SongUploaded from "@/components/SongUploaded.vue";
import useNotificationsStore from "@/stores/notifications";
import useUserStore from "@/stores/user";

export default {
  components: { SongUploaded },
  data() {
    return {
      albums: [],
      isDragover: false,
      songs: [],
      unsavedFlag: false,
      uploads: [],
    };
  },
  async created() {
    await this.getUserData();
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
  beforeUnmount() {
    this.cancelUpload();
  },
  computed: {
    ...mapState(useUserStore, ["userId"]),
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),

    addSong(doc) {
      this.songs.push({
        ...doc.data(),
        id: doc.id,
      });
    },

    addAlbum(doc) {
      this.albums.push({
        ...doc.data(),
        id: doc.id,
      });
    },

    async getDocName(collectionName, name) {
      const q = query(
        collection(db, collectionName),
        where("name", "==", name),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      let docRef = querySnapshot.docs[0];

      // If doc doesn't exist create it and return id
      if (!doc) {
        docRef = await addDoc(collection(db, collectionName), {
          name: name,
        });
      }

      return docRef.data().name;
    },

    async getUserData() {
      // Query albums and songs collections and get only this user items
      const [albumsSnapshot, songsSnapshot] = await Promise.all([
        getDocs(
          query(collection(db, "albums"), where("userId", "==", this.userId))
        ),
        getDocs(
          query(collection(db, "songs"), where("userId", "==", this.userId))
        ),
      ]);

      albumsSnapshot.forEach(this.addAlbum);
      songsSnapshot.forEach(this.addSong);
    },

    async getMetadata(file) {
      return new Promise((resolve, reject) => {
        jsmediatags.read(file, {
          onSuccess: async (tag) => {
            const metadata = tag.tags;

            let pictureData = "";
            const picture = metadata.picture;
            if (picture) {
              // Convert image data to JPEG file
              const pictureBase64 = picture.data
                .map((charCode) => String.fromCharCode(charCode))
                .join("");

              pictureData = `data:${picture.format};base64,${window.btoa(
                pictureBase64
              )}`;
            }

            // Convert TPOS to disc info
            const tposData = metadata.TPOS
              ? metadata.TPOS.data.split("/")
              : ["", ""];

            // Convert track to track info
            const trackData = metadata.track ? metadata.track.split("/") : "";

            // If year is store in TDRC, get only year
            // else get just year
            const yearData = metadata.TDRC
              ? metadata.TDRC.data.slice(0, 4)
              : metadata.year
              ? metadata.year
              : "";

            resolve({
              album: metadata.album || "",
              artist: await this.getDocName("artists", metadata.artist),
              author: metadata.TCOM.data || "",
              disc: tposData[0],
              discTotal: tposData[1],
              genre: await this.getDocName("genres", metadata.genre),
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

    async updateAlbumDoc(metadata, songSnapshot) {
      const albumsQuery = query(
        collection(db, "albums"),
        where("artist", "==", metadata.artist),
        where("name", "==", metadata.album),
        limit(1)
      );

      const albumsSnapshot = await getDocs(albumsQuery);
      let albumDoc = albumsSnapshot.docs[0];

      if (albumDoc) {
        // If album with artist and name exist add new song
        await updateDoc(doc(db, "albums", albumDoc.id), {
          songs: arrayUnion({ id: songSnapshot.id }),
        });
      } else {
        // If doesn't exist create new document
        albumDoc = await addDoc(collection(db, "albums"), {
          artist: metadata.artist,
          name: metadata.album,
          picture: metadata.picture,
          songs: [{ id: songSnapshot.id }],
          userId: this.userId,
        });

        this.addAlbum(await getDoc(albumDoc));
      }

      // Add albumId to uploaded song
      await updateDoc(doc(db, "songs", songSnapshot.id), {
        albumId: albumDoc.id,
      });
    },

    updateAlbumPicture(albumId, picture) {
      const index = this.albums.findIndex((album) => album.id === albumId);
      this.albums[index].picture = picture;
    },

    updateSongDetails(index, values) {
      this.songs[index].album = values.album;
      this.songs[index].artist = values.artist;
      this.songs[index].author = values.author;
      this.songs[index].disc = values.disc;
      this.songs[index].discTotal = values.discTotal;
      this.songs[index].genre = values.genre;
      this.songs[index].lyrics = values.lyrics;
      this.songs[index].title = values.title;
      this.songs[index].track = values.track;
      this.songs[index].trackTotal = values.trackTotal;
      this.songs[index].year = values.year;
    },

    updateSongPicture(songId, picture) {
      const index = this.songs.findIndex((song) => song.id === songId);
      this.songs[index].picture = picture;
    },

    removeAlbum(id) {
      this.albums.forEach((album, index) => {
        if (album.id === id) {
          this.albums.splice(index, 1);
          return;
        }
      });
    },

    removeSong(index) {
      this.songs.splice(index, 1);
    },

    updateProgressBar(snapshot, uploadIndex) {
      const progress = Math.ceil(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      return (this.uploads[uploadIndex].current_progress = progress);
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },

    async upload($event) {
      this.isDragover = false;

      // Use destructuring assignment to extract files from the event object
      const files = [...($event.dataTransfer?.files || $event.target.files)];

      for (const file of files) {
        if (file.type !== "audio/mpeg") {
          this.setNotification(
            "error",
            "Wrong file format",
            "You can only upload mpeg files"
          );
          return;
        }

        // Get file metadata
        const metadata = await this.getMetadata(file);

        // Create song ref
        const songRef = ref(storage, `songs/${this.userId}/${file.name}`);

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
          (snapshot) => this.updateProgressBar(snapshot, uploadIndex),
          () => {
            this.uploads[uploadIndex].variant = "error";
            this.setNotification(
              "error",
              "Something went wrong",
              "We couldn't upload your files"
            );
          },
          async () => {
            const songRef = await addDoc(collection(db, "songs"), {
              ...metadata,
              fileName: file.name,
              userId: this.userId,
              url: await getDownloadURL(task.snapshot.ref),
            });
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
  },
};
</script>

<style lang="scss">
#upload {
  display: flex;
  flex-direction: column;
  gap: 36px;

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

  #uploaded-albums {
    @include albums-list;
  }
}
</style>
