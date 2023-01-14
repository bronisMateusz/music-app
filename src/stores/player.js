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
    currentSongIndex: 0,
    songsQueue: [],
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
      // If song is playing, return
      if (this.currentSong.id === song.id && this.playing) return;
      // If current song is paused
      if (this.currentSong.id === song.id && !this.playing) {
        this.toggleAudio();
        return;
      }
      // If song is stored, remove an instance of it
      if (this.sound instanceof Howl) this.sound.unload();

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
        this.clearSeekInterval();
      });

      this.sound.on("end", () => {
        this.playing = false;
        this.seek = "0:00";
        this.seekPosition = 0;
        this.clearSeekInterval();
        this.playNext();
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

    playNext() {
      // Check if there are more songs in the queue
      if (this.songsQueue.length > 0) {
        this.currentSongIndex++;

        // If currentIndex is equal to the last index of the songsQueue array
        if (this.currentSongIndex === this.songsQueue.length) {
          this.clearPlayer();
          return;
        }

        // Play next song in the queue
        this.newSong(this.songsQueue[this.currentSongIndex]);
      }
    },

    playPrevious() {
      // Check if there are more songs in the queue before the current song
      if (this.songsQueue.length > 1) {
        // decrement the currentSongIndex
        this.currentSongIndex--;

        // if the currentSongIndex is less than 0
        // set the currentSongIndex to the last song in the queue
        if (this.currentSongIndex < 0)
          this.currentSongIndex = this.songsQueue.length - 1;

        // Play the previous song in the queue
        this.newSong(this.songsQueue[this.currentSongIndex]);
      }
    },

    clearPlayer() {
      // Destroy Howl instance
      this.sound.unload();
      this.sound = {};

      // Set currentSong back to first song from queue
      this.currentSong = {
        artist: "Artist",
        id: "",
        picture: "",
        title: "Song title",
      };

      // Set currentIndex back to 0
      this.currentSongIndex = 0;

      // Clear queue
      this.songsQueue = [];
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

    updateSeek(event) {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.seekPosition = parseInt(event.target.value);
      this.seek = helper.formatTime(this.sound.seek());
    },

    updateVolume(direction) {
      if (direction === "up") this.volume = Math.min(100, this.volume + 5);
      if (direction === "down") this.volume = Math.max(0, this.volume - 5);
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.sound.volume(this.volume / 100);
    },
  },
});
