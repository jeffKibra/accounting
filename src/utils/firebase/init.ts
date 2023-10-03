import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

import firebaseConfig from 'config/firebaseConfig';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app, 'asia-south1');
export const storage = getStorage(app);

const appEnv = process.env.REACT_APP_ENV;
console.log({ appEnv });

const isDev = appEnv === 'dev';

const localhost = 'localhost';
// ('127.0.0.1');

if (isDev) {
  // connectFirestoreEmulator(db, localhost, 8080);
  connectFunctionsEmulator(functions, localhost, 5001);
}
