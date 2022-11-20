import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXBZJoWyFfNBm7Xfz15YBgmF5A3jyB6eE",
  authDomain: "music-app-11ce6.firebaseapp.com",
  projectId: "music-app-11ce6",
  storageBucket: "music-app-11ce6.appspot.com",
  appId: "1:754991169134:web:b8fde588bcbeec8f1df07f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersCollection = collection(db, "users");

export { auth, usersCollection };
