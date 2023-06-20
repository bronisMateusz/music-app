<template>
  <ul id="uploaded-songs">
    <li v-if="!showForm">
      <div
        class="song-cover"
        :style="{
          'background-image': song.picture
            ? `url(${song.picture})`
            : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)'
        }"
        @click.prevent="newSong(song)"
      />
      <div class="song-details" @click.prevent="newSong(song)">
        <button class="song-title">
          {{ song.title || 'Undefined' }}
        </button>
        <span class="song-artist">{{ song.artist || 'Undefined' }}</span>
      </div>
      <button @click.prevent="toggleFormVisibility">
        <eva-icon name="more-horizontal-outline" height="28" width="28" />
      </button>
      <button @click.prevent="deleteSong">
        <eva-icon name="close-outline" height="28" width="28" />
      </button>
    </li>
    <li v-else>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="editMetadata">
        <div class="song-cover-wrapper">
          <div
            class="song-cover"
            :style="{
              'background-image': song.picture
                ? `url(${song.picture})`
                : 'conic-gradient(from 180deg at 50% 50%, #616db9 0deg, #bfc5fc 360deg)'
            }"
            @dragend.prevent.stop="isDragover = false"
            @dragover.prevent.stop="isDragover = true"
            @dragenter.prevent.stop="isDragover = true"
            @dragleave.prevent.stop="isDragover = false"
            @drop.prevent.stop="uploadCover($event)"
          >
            <label v-if="!isDragover" for="file-input">browse</label>
            <label v-else for="file-input" class="dragover">
              <eva-icon name="cloud-upload-outline" height="72" width="72" />
            </label>
            <input id="file-input" class="hidden" type="file" @change="uploadCover($event)" />
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
              placeholder="Enter album"
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
            <vee-field type="number" name="disc" placeholder="0" @input="updateUnsavedFlag(true)" />
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
  </ul>
</template>

<script>
import { db, storage } from '@/includes/firebase'
import { ref, deleteObject } from 'firebase/storage'
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { mapActions, mapState } from 'pinia'
import useNotificationsStore from '@/stores/notifications'
import usePlayerStore from '@/stores/player'
import useUserStore from '@/stores/user'

export default {
  props: {
    addAlbum: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    song: {
      type: Object,
      required: true
    },
    removeAlbum: {
      type: Function,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateAlbumDoc: {
      type: Function,
      required: true
    },
    updateArtistDoc: {
      type: Function,
      required: true
    },
    updateAlbumPicture: {
      type: Function,
      required: true
    },
    updateSongDetails: {
      type: Function,
      required: true
    },
    updateSongPicture: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      isDragover: false,
      showForm: false,
      schema: {
        title: 'required',
        artist: 'required',
        album: 'required',
        genre: 'required|min:3|max:100|alphaSpaces'
      }
    }
  },
  computed: {
    ...mapState(useUserStore, ['userId'])
  },
  methods: {
    ...mapActions(useNotificationsStore, ['setNotification']),
    ...mapActions(usePlayerStore, ['newSong']),

    async deleteSong() {
      this.setNotification('notice', 'Please wait', "We're removing this song")

      try {
        const songRef = ref(storage, `songs/${this.userId}/${this.song.fileName}`)

        // Delete song from Storage
        await deleteObject(songRef)
        // Delete song from Firestore
        await deleteDoc(doc(db, 'songs', this.song.id))

        await this.removeSongRelationships('albums', this.song.albumId)
        await this.removeSongRelationships('artists', this.song.artistId)
        this.removeAlbum(this.song.albumId)
        this.removeSong(this.index)

        this.setNotification('success', 'Success!', 'Song has been removed')
      } catch (error) {
        this.setNotification('error', 'Something went wrong', "We couldn't remove this song")
      }
    },

    async editMetadata(values) {
      const songRef = doc(db, 'songs', this.song.id)
      try {
        await updateDoc(songRef, {
          album: values.album,
          artist: values.artist,
          author: values.author,
          disc: parseInt(values.disc),
          discTotal: parseInt(values.discTotal),
          genre: values.genre,
          lyrics: values.lyrics,
          title: values.title,
          track: parseInt(values.track),
          trackTotal: parseInt(values.trackTotal),
          year: parseInt(values.year)
        })

        const songSnapshot = await getDoc(songRef)
        const data = songSnapshot.data()

        if (this.song.album !== values.album) {
          await this.removeSongRelationships('albums', this.song.albumId)
          this.removeAlbum(this.song.albumId)
          await this.updateAlbumDoc(data, songSnapshot)
        }

        if (this.song.artist !== values.artist) {
          await this.removeSongRelationships('artists', this.song.artistId)
          await this.updateArtistDoc(data, songSnapshot)
        }
      } catch (error) {
        this.setNotification('error', 'Something went wrong', "We couldn't update song details")
        return
      }

      this.updateSongDetails(this.index, values)

      this.setNotification('success', 'Success!', 'Song details updated')
      this.toggleFormVisibility()
    },

    async getAllSongFromAlbum() {
      const songsQuery = query(collection(db, 'songs'), where('albumId', '==', this.song.albumId))
      const songsSnapshot = await getDocs(songsQuery)
      return songsSnapshot.docs
    },

    async getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    async removeSongRelationships(collectionName, docId) {
      // Remove the song from the album's songs array
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)

      let data = docSnap.data()
      data.songs = data.songs.filter((song) => song.id !== this.song.id)
      // If any song left in album, update album doc, else remove whole album doc
      data.songs.length
        ? await updateDoc(docRef, data)
        : await deleteDoc(doc(db, collectionName, docId))
    },

    toggleFormVisibility() {
      this.showForm = !this.showForm
      this.updateUnsavedFlag(false)
    },

    async updateAllSongsPictures(songsDocs, pictureBase64) {
      songsDocs.map(async (doc) => {
        await updateDoc(doc.ref, {
          picture: pictureBase64
        })
        this.updateSongPicture(doc.id, pictureBase64)
      })
    },

    async uploadCover(event) {
      this.isDragover = false
      this.setNotification('notice', 'Please wait', "We're updating cover...")

      const file = event.dataTransfer
        ? [...event.dataTransfer.files][0]
        : [...event.target.files][0]

      if (file.type !== 'image/jpeg') {
        this.setNotification('error', 'Wrong file format', 'You can only upload jpeg files')
        return
      }

      try {
        const pictureBase64 = await this.getBase64(file)

        // Update picture of all songs in album
        const songsDocs = await this.getAllSongFromAlbum()
        await this.updateAllSongsPictures(songsDocs, pictureBase64)

        // Update album picture
        await updateDoc(doc(db, 'albums', this.song.albumId), {
          picture: pictureBase64
        })
        this.updateAlbumPicture(this.song.albumId, pictureBase64)

        this.setNotification('success', 'Success', 'Cover updated!')
      } catch (error) {
        this.setNotification('error', 'Something went wrong', "We couldn't update cover")
      }
    }
  }
}
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
      grid-template-columns: auto 1fr;
      gap: 12px;
      margin-bottom: 12px;

      .song-cover label {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 15px;
        width: 70px;
        height: 70px;
        color: transparent;

        &.dragover {
          background-color: rgba($text-primary, 0.9);
          color: $text-primary-inverted;
        }
      }

      .song-cover-info {
        align-self: center;

        ul {
          margin-top: 8px;
          padding-left: 16px;
          color: $text-secondary;
          list-style: disc;

          li p {
            font-size: 0.75rem;
            line-height: 1rem;
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

    @media (min-width: $md) {
      grid-template-columns: 1fr 1fr;

      .song-cover-wrapper,
      div:nth-of-type(12) {
        grid-column: 1/3;

        .song-cover,
        .song-cover label {
          width: 124px;
          height: 124px;
        }
      }

      .form-group {
        grid-column: 2;
      }
    }
  }
}
</style>
