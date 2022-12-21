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
        <p>Drop your file(s) here or browse</p>
        <span>Maximum file size is 25 MB</span>
      </div>
      <div v-else>
        <eva-icon name="cloud-upload-outline" height="72" width="72" />
        <p>Drop your file(s) to upload</p>
      </div>
    </div>
    <input type="file" />
  </section>
  <!-- Upload progress -->
  <section>
    <h2>Upload progress</h2>
    <ul id="upload-progress">
      <li v-for="upload in uploads" :key="upload.name">
        <div class="song-details" :class="upload.variant">
          <span class="song-cover" />
          <a href="#" class="song-title">{{ upload.name }}</a>
          <span class="song-artist">Artist Name</span>
          <!-- Progress bar -->
          <div class="progress-bar">
            <div class="bar">
              <div
                class="inner-bar"
                :style="{ width: upload.current_progress + '%' }"
              />
            </div>
            <span v-if="upload.variant === 'error'" class="progress-value">
              error
            </span>
            <span v-else class="progress-value">
              {{ upload.current_progress }}&nbsp;%
            </span>
          </div>
        </div>
        <eva-icon class="options" name="close-outline" height="28" width="28" />
      </li>
    </ul>
  </section>
  <!-- Uploaded albums -->
  <section>
    <h2>Uploaded albums</h2>
  </section>
  <!-- Uploaded songs -->
  <section>
    <h2>Uploaded songs</h2>
    <ul id="uploaded-songs">
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
    </ul>
  </section>
</template>
<script>
import { storage } from "@/includes/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { mapActions } from "pinia";
import useNotificationsStore from "@/stores/notifications";

export default {
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    ...mapActions(useNotificationsStore, ["setNotification"]),
    upload($event) {
      this.is_dragover = false;

      const files = [...$event.dataTransfer.files];
      files.forEach((file) => {
        if (file.type !== "audio/mpeg") return;

        const songsRef = ref(storage, `songs/${file.name}`);
        const task = uploadBytesResumable(songsRef, file);

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
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
          () => {
            this.setNotification(
              "success",
              "Success!",
              "Your files just landed on the server"
            );
          }
        );
      });
    },
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
    }
  }
}

#upload-progress,
#uploaded-songs {
  @include songs-list;

  .song-details {
    @include song-details(2);
  }
}

#upload-progress {
  .song-details {
    @include song-details(3);

    &.error {
      .song-title,
      .song-artist,
      .progress-bar {
        color: $text-error;
      }

      .progress-bar .bar .inner-bar {
        background-color: $text-error;
      }
    }

    .progress-bar {
      @include progress-bar;
      grid-area: 3 / 2 / 4 / 3;
      height: fit-content;
      margin-right: 30px;
      width: calc(100% - 24px);

      .progress-value {
        min-width: 2.75rem;
        text-align: right;
      }
    }
  }
}
</style>
