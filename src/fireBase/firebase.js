// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import conf from '../conf/conf.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: conf.firebaseApikey,
  authDomain: conf.firebaseAuthDomain,
  databaseURL: conf.firebaseDatabaseURL,
  projectId: conf.firebaseProjectId,
  storageBucket: conf.firebaseStorageBucket,
  messagingSenderId: conf.firebaseMessagingSenderId,
  appId: conf.firebaseAppId,
  measurementId: conf.firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth and Database instances
const auth = getAuth(app);
const database = getDatabase(app);

// Export the instances for use in other parts of the app
export { auth, PhoneAuthProvider, database };
