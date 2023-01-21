import { defineStore } from "pinia";
import { db } from "@/includes/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default defineStore("favorites", {
  state: () => ({
    favAlbums: [],
    favDocId: "",
    favSongs: [],
    isFavDocExist: false,
  }),

  actions: {
    async getFavorites(userId) {
      this.favDocId = userId;
      const favoritesRef = doc(db, "favorites", userId);
      const favoritesSnapshot = await getDoc(favoritesRef);
      const data = favoritesSnapshot.data();

      if (!data) return;

      this.isFavDocExist = true;
      this.favSongs = data.songs || [];
      this.favAlbums = data.albums || [];
    },
    addToFav(type, id) {
      if (type === "song") this.favSongs.push({ id: id });
      if (type === "album") this.favAlbums.push({ id: id });
    },

    async addToFavorites(field, item) {
      const favoritesRef = doc(db, "favorites", this.favDocId);
      this.isFavDocExist
        ? await updateDoc(favoritesRef, {
            [field]: arrayUnion({ id: item.id }),
          })
        : await setDoc(favoritesRef, {
            [field]: [{ id: item.id }],
          });

      item.inFavorites = true;
    },

    async removeFromFavorites(field, item) {
      await updateDoc(doc(db, "favorites", this.favDocId), {
        [field]: arrayRemove({ id: item.id }),
      });

      item.inFavorites = false;
    },
  },
});
