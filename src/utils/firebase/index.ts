import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  CollectionReference,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

import firebaseConfig from "../../config/firebaseConfig";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);

export { default as dbCollections } from "./dbCollections";

export const createCollection = <T>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};