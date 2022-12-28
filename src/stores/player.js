import { defineStore } from "pinia";
import { Howl } from "howler";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
  }),
  actions: {
    async newSong(song) {
      this.currentSong = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sound.play();
    },
  },
});
