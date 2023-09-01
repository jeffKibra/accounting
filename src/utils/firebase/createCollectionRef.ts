import { collection, CollectionReference } from 'firebase/firestore';
//
import { db } from './init';

const createCollectionRef = <T>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export default createCollectionRef;
