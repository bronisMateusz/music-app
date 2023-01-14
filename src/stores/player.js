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
    loopMode: 0,
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

      this.sound.on("end", () => this.playNext());
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

    playAgain() {
      this.sound.stop();
      this.sound.play();
    },

    playNext() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      // Play current song looped, play again
      if (this.loopMode === 2 && this.sound) {
        this.playAgain();
        return;
      }

      this.currentSongIndex++;
      const queueLength = this.songsQueue.length;

      // If only one song is in queue or
      // If no loop is set and it is last song in queue, clear player
      if (
        queueLength === 0 ||
        (this.loopMode === 0 && this.currentSongIndex === queueLength)
      ) {
        this.clearSeekInterval();
        this.clearPlayer();
        return;
      }

      // If loop is set and it is last song i queue, play again all queue
      if (this.currentSongIndex === queueLength) this.currentSongIndex = 0;

      this.newSong(this.songsQueue[this.currentSongIndex]);
    },

    playPrevious() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      // Play current song looped, play again
      if (this.loopMode === 2 && this.sound) {
        this.playAgain();
        return;
      }

      this.currentSongIndex--;
      const queueLength = this.songsQueue.length;

      // If only one song is in queue or
      // If no loop is set and currentSongIndex is less than 0
      if (
        queueLength === 0 ||
        (this.loopMode === 0 && this.currentSongIndex < 0)
      ) {
        this.clearSeekInterval();
        this.clearPlayer();
        return;
      }
      // If currentSongIndex is less than 0
      if (this.currentSongIndex < 0) this.currentSongIndex = queueLength - 1;

      this.newSong(this.songsQueue[this.currentSongIndex]);
    },

    clearPlayer() {
      // Destroy Howl instance
      this.sound.unload();

      // Set states to default values
      this.currentSong = {
        artist: "Artist",
        id: "",
        picture: "",
        title: "Song title",
      };
      this.currentSongIndex = 0;
      this.songsQueue = [];
      this.sound = {};
      this.seekPosition = 0;
      this.seek = "0:00";
      this.duration = "0:00";
      this.playing = false;
    },

    async toggleAudio() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      // If song is stored, toggle audio
      this.playing ? this.sound.pause() : this.sound.play();
    },

    toggleLoop() {
      if (this.loopMode === 2) {
        this.loopMode = 0;
        return;
      }

      this.loopMode++;
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
