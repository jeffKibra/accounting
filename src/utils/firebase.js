import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBTpBfJ8A6Byg5qaCs3pcFI60TIXmg4igw",
  authDomain: "lehi-76a0d.firebaseapp.com",
  projectId: "lehi-76a0d",
  storageBucket: "lehi-76a0d.appspot.com",
  messagingSenderId: "440448600916",
  appId: "1:440448600916:web:46de09a150e69e769716c1",
  measurementId: "G-TFED4L6D0Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);
