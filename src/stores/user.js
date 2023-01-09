import { defineStore } from "pinia";
import { auth, db, storage } from "@/includes/firebase";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, setDoc } from "firebase/firestore";

export default defineStore("user", {
  state: () => ({
    displayName: "",
    photoURL: "",
    userLoggedIn: false,
    userId: "",
  }),
  actions: {
    async register(values) {
      // Create user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Set user profile in firebase
      await updateProfile(userCred.user, {
        displayName: values.name,
      });

      // Set user data in firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        displayName: values.name,
        email: values.email,
      });

      // Set store details
      this.setStoreDetails(userCred.user);
    },

    async login(values) {
      // Closing the window would clear any existing state even if a user forgets to sign out.
      !values.remember
        ? await setPersistence(auth, browserSessionPersistence).then(() => {
            // Sign in user
            return signInWithEmailAndPassword(
              auth,
              values.email,
              values.password
            );
          })
        : await signInWithEmailAndPassword(auth, values.email, values.password);

      // Set store details
      this.setStoreDetails(auth.currentUser);
    },

    async logout() {
      signOut(auth);
      this.userLoggedIn = false;
      window.location.reload();
    },

    async resetPassword(email) {
      await sendPasswordResetEmail(auth, email);
    },

    setStoreDetails(user) {
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.userId = user.uid;
      this.userLoggedIn = true;
    },

    async updateProfile(user) {
      // Update user profile in firebase
      await updateProfile(auth.currentUser, user);

      // Update user data in firestore
      const userRef = doc(db, "users", this.userId);
      await updateDoc(userRef, user);

      // Update store displayName
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    },

    async uploadPhoto(file) {
      const userPhotosRef = ref(
        storage,
        `userPhotos/${this.userId}/${Date.now()}-${file.name}`
      );

      // Upload photo to Firebase storage
      await uploadBytes(userPhotosRef, file);

      await this.updateProfile({
        displayName: this.displayName,
        photoURL: await getDownloadURL(userPhotosRef),
      });
    },
  },
});
