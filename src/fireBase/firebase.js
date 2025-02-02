// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { PhoneAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import conf from '../conf/conf.js';
import { getAuth } from 'firebase/auth';

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


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };