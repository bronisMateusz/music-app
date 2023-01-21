import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {
      albumId: "",
      artist: "Artist",
      id: "",
      inFavorites: false,
      picture: "",
      title: "Song title",
    },
    currentSongIndex: 0,
    duration: "0:00",
    interval: null,
    loopMode: 0,
    playing: false,
    randomPlay: false,
    seek: "0:00",
    seekPosition: 0,
    songsQueue: [],
    sound: {},
    volume: 100,
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
        albumId: song.albumId,
        artist: song.artist,
        id: song.id,
        inFavorites: song.inFavorites,
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

      this.sound.on("end", () => this.changeSong(1));
    },

    changeSeek() {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.sound.seek((this.seekPosition / 100) * this.sound.duration());
    },

    changeSong(indexModifier) {
      // If no song is is stored, return
      if (!this.sound.playing) return;

      this.clearSeekInterval();

      // Play current song looped, play again
      if (this.loopMode === 2 && this.sound) {
        this.playAgain();
        return;
      }

      this.randomPlay
        ? this.playRandom()
        : this.updateCurrentSongIndex(indexModifier);
    },

    changeVolume(event) {
      this.volume = parseInt(event.target.value);

      // If no song is is stored, return
      if (!this.sound.playing) return;
      this.sound.volume(this.volume / 100);
    },

    clearPlayer() {
      // Destroy Howl instance
      this.sound.unload();

      // Set states to default values
      this.currentSong = {
        albumId: "",
        artist: "Artist",
        id: "",
        picture: "",
        title: "Song title",
      };
      this.currentSongIndex = 0;
      this.duration = "0:00";
      this.playing = false;
      this.seek = "0:00";
      this.seekPosition = 0;
      this.songsQueue = [];
      this.sound = {};
    },

    clearSeekInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },

    playAgain() {
      this.sound.stop();
      this.sound.play();
    },

    playRandom() {
      if (this.randomPlay) {
        // Generate a random index for the song in the queue
        let randomIndex = Math.floor(Math.random() * this.songsQueue.length);

        while (randomIndex === this.currentSongIndex) {
          randomIndex = Math.floor(Math.random() * this.songsQueue.length);
        }

        this.currentSongIndex = randomIndex;
        this.newSong(this.songsQueue[this.currentSongIndex]);
      }
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

    updateCurrentSongIndex(indexModifier) {
      const queueLength = this.songsQueue.length;

      // Check if the queue is empty
      if (queueLength === 0) {
        this.clearPlayer();
        return;
      }

      // Update the current songIndex based on the indexModifier
      this.currentSongIndex += indexModifier;

      // Create a condition depending on the direction of the song change
      const condition =
        indexModifier === 1
          ? this.currentSongIndex === queueLength
          : this.currentSongIndex < 0;

      // Check if the currentSongIndex is out of bounds
      if (condition) {
        // Check if loop mode is enabled
        if (this.loopMode === 0) {
          this.clearPlayer();
          return;
        } else {
          // If indexModifier is equal to 1, play song from queue start
          // else play from queue end
          this.currentSongIndex = indexModifier === 1 ? 0 : queueLength - 1;
        }
      }

      // Play the new song
      this.newSong(this.songsQueue[this.currentSongIndex]);
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
