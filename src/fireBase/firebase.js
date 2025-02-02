// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/compat/app";
import { getAuth } from "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5hFxxgiJ5M2WDA2EMKQab-BQDiyQ77Uw",
  authDomain: "bharat-linker.firebaseapp.com",
  projectId: "bharat-linker",
  storageBucket: "bharat-linker.firebasestorage.app",
  messagingSenderId: "1000044979704",
  appId: "1:1000044979704:web:506d4ca6156eea1113e20d",
  measurementId: "G-YTCLD8FG2J"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
