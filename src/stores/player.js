import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {
      artist: "Artist",
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
      if (this.currentSong.url === song.url) return;
      if (this.interval) clearInterval(this.interval);

      // Store details from Firebase
      this.currentSong = {
        artist: song.artist,
        picture: song.picture,
        title: song.title,
      };

      // Create Howl object
      this.sound = new Howl({
        src: [song.url],
        html5: true,
        volume: this.volume / 100,
      });

      this.sound.once("load", () => {
        this.duration = helper.formatTime(this.sound.duration());
      });

      this.sound.on("play", () => {
        // Start the interval to update the seek
        this.playing = true;
        this.interval = setInterval(() => {
          this.seek = helper.formatTime(this.sound.seek());
          this.seekPosition = (this.sound.seek() / this.sound.duration()) * 100;
        }, 1000);
      });

      this.sound.on("pause", () => {
        this.playing = false;
        clearInterval(this.interval);
      });

      this.sound.on("end", () => {
        this.playing = false;
        // Reset seek and clear the interval when the song ends
        this.seek = "0:00";
        this.seekPosition = 0;
        clearInterval(this.interval);
      });

      // Play audio file
      this.sound.play();
    },
    changeSeek() {
      if (!this.sound.playing) return;

      this.sound.seek((this.seekPosition / 100) * this.sound.duration());
    },
    changeVolume(event) {
      this.volume = parseInt(event.target.value);

      if (!this.sound.playing) return;
      this.sound.volume(this.volume / 100);
    },
    updateSeek(event) {
      if (!this.sound.playing) return;

      this.seekPosition = parseInt(event.target.value);
      this.seek = helper.formatTime(
        (this.seekPosition / 100) * this.sound.duration()
      );
    },
    updateVolume(direction) {
      if (direction === "up") this.volume = Math.min(100, this.volume + 5);
      if (direction === "down") this.volume = Math.max(0, this.volume - 5);
      if (!this.sound.playing) return;

      this.sound.volume(this.volume / 100);
    },
    async toggleAudio() {
      if (!this.sound.playing) return;
      this.playing ? this.sound.pause() : this.sound.play();
    },
    toggleLoop() {
      this.loop = !this.loop;

      if (!this.sound.playing) return;
      this.sound.loop(this.loop);
    },
  },
});
