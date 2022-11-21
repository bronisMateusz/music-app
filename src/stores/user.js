import { defineStore } from "pinia";
import { auth, db } from "@/includes/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      await createUserWithEmailAndPassword(auth, values.email, values.password);

      await addDoc(collection(db, "users"), {
        name: values.name,
        email: values.email,
      });

      this.userLoggedIn = true;
    },
  },
});
