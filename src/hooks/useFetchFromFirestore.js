import { useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';

import { db } from 'utils/firebase';

export default function useFetchFromFirestore() {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function get(docPath) {
    try {
      const docRef = doc(db, docPath);
      const snap = await getDoc(docRef);
      const result = {
        id: snap.id,
        ...snap.data(),
      };

      setData(result);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const isLoading = !data && !error;

  return { data, error, get, isLoading };
}
