import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seekPosition: "0",
    seek: "0:00",
    duration: "0:00",
    isPlaying: false,
  }),
  actions: {
    async newSong(song) {
      if (this.currentSong.url === song.url) return;
      if (this.sound instanceof Howl) this.sound.unload();

      // Store details from Firebase
      this.currentSong = song;

      // Initialize the song with the Howler library
      this.sound = new Howl({
        src: [song.url],
        html5: true,
        onload: () => {
          this.duration = helper.formatTime(this.sound.duration());
        },
        onplay: () => {
          // Start the interval to update the current time and seek position
          this.interval = setInterval(() => {
            this.seek = helper.formatTime(this.sound.seek());
            this.seekPosition =
              (this.sound.seek() / this.sound.duration()) * 100;
          }, 1000);
        },
        onend: () => {
          // Clear the interval when the song ends
          this.seek = "0:00";
          this.seekPosition = 0;
          clearInterval(this.interval);
        },
      });
      this.sound.play();
    },
    async toggleAudio() {
      if (!this.sound.playing) return;
      this.sound.playing() ? this.sound.pause() : this.sound.play();
    },
    updateSeek(event) {
      this.seekPosition = event.target.value;
      this.seek = helper.formatTime(
        (this.seekPosition / 100) * this.sound.duration()
      );
    },
    changeSeek() {
      this.sound.seek((this.seekPosition / 100) * this.sound.duration());
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) return state.sound.playing();

      return false;
    },
  },
});
