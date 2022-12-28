import { defineStore } from "pinia";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
  }),
  actions: {
    async newSong(song) {
      this.currentSong = song;
    },
  },
});
