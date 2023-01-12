import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {
      artist: "Artist",
      id: "",
      picture: "",
      title: "Song title",
    },
    sound: {},
    seekPosition: 0,
    seek: "0:00",
    duration: "0:00",
    volume: 100,
    interval: null,
    loop: false,
    playing: false,
  }),
  actions: {
    async newSong(song) {
      // If current song is equal to new song, return
      if (this.currentSong.id === song.id) return;
      // If song is stored, remove an instance of it from memory
      if (this.sound instanceof Howl) this.sound.unload();
      // If interval is set, clear it
      if (this.interval) this.clearSeekInterval;

      // Store song details from Firebase
      this.currentSong = {
        artist: song.artist,
        id: song.id,
        picture: song.picture,
        title: song.title,
      };

      // Create Howl object
      this.sound = new Howl({
        autoplay: true,
        src: [song.url],
        html5: true,
        volume: this.volume / 100,
      });

      // Set song duration on load
      this.sound.once("load", () => {
        this.duration = helper.formatTime(this.sound.duration());
      });

      this.sound.on("play", () => {
        // Start the interval to update the seek
        this.playing = true;

        // Update seek and seekPosition on every second
        this.interval = setInterval(() => {
          this.seek = helper.formatTime(this.sound.seek());
          this.seekPosition = (this.sound.seek() / this.sound.duration()) * 100;
        }, 1000);
      });

      this.sound.on("pause", () => {
        this.playing = false;
        this.clearSeekInterval;
      });

      this.sound.on("end", () => {
        this.playing = false;
        this.seek = "0:00";
        this.seekPosition = 0;
        this.clearSeekInterval;
      });
    },
    changeSeek() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.sound.seek((this.seekPosition / 100) * this.sound.duration());
    },
    changeVolume(event) {
      this.volume = parseInt(event.target.value);

      // If no song is is stored, return
      if (!this.sound.playing) return;
      this.sound.volume(this.volume / 100);
    },
    clearSeekInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },
    updateSeek(event) {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.seekPosition = parseInt(event.target.value);
      this.seek = helper.formatTime(
        (this.seekPosition / 100) * this.sound.duration()
      );
    },
    updateVolume(direction) {
      if (direction === "up") this.volume = Math.min(100, this.volume + 5);
      if (direction === "down") this.volume = Math.max(0, this.volume - 5);
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.sound.volume(this.volume / 100);
    },
    async toggleAudio() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      // If song is stored, toggle audio
      this.playing ? this.sound.pause() : this.sound.play();
    },
    toggleLoop() {
      this.loop = !this.loop;

      if (!this.sound.playing) return;
      this.sound.loop(this.loop);
    },
  },
});
