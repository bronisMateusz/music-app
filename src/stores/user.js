import { defineStore } from "pinia";
import { auth, db } from "@/includes/firebase";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: values.name,
        email: values.email,
      });

      await updateProfile(userCred.user, {
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },

    async login(values) {
      console.log(values);

      if (!values.remember) {
        await setPersistence(auth, browserSessionPersistence)
          .then(() => {
            // Closing the window would clear any existing state even if a user forgets to sign out.

            // Sign in user
            return signInWithEmailAndPassword(
              auth,
              values.email,
              values.password
            );
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      }

      this.userLoggedIn = true;
    },

    async logout() {
      signOut(auth);
      this.userLoggedIn = false;
    },

    async resetPassword(email) {
      await sendPasswordResetEmail(auth, email);
    },
  },
});
