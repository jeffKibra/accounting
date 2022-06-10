import { doc } from "firebase/firestore";

import { db } from "../firebase";

export default async function getCountersData(transaction, orgId) {
  const docRef = doc(db, "organizations", orgId, "summaries", "counters");

  const countersDoc = await transaction.get(docRef);

  if (!countersDoc.exists) throw new Error("counters summary not found!");

  return countersDoc.data();
}
