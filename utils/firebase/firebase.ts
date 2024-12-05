// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCVp_SI79owhNonQ1TJP5fO9ls14ZzUUM",
  authDomain: "music-mates-e633a.firebaseapp.com",
  projectId: "music-mates-e633a",
  storageBucket: "music-mates-e633a.firebasestorage.app",
  messagingSenderId: "549625757202",
  appId: "1:549625757202:web:4d60cac3f0ce1c450b62cb",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { storage }
