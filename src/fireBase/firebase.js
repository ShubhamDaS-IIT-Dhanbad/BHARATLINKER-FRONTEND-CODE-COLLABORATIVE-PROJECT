// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import conf from '../conf/conf.js';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: conf.firebaseApikey,
  authDomain:conf.firebaseAuthDomain,
  databaseURL: conf.firebaseDatabaseURL,
  projectId: conf.firebaseProjectId,
  storageBucket: conf.firebaseStorageBucket,
  messagingSenderId: conf.firebaseMessagingSenderId,
  appId: conf.firebaseAppId,
  measurementId: conf.firebaseMeasurementId
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const database = getDatabase(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider(); // Google Auth provider

// Export the initialized instances and provider
export { app, auth, database, provider };
