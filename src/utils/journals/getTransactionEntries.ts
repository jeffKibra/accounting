import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import { EntryWithStatus, TransactionTypes } from "../../types";

export default async function getTransactionEntries(
  orgId: string,
  transactionId: string,
  transactionType: keyof TransactionTypes
) {
  // console.log({ transactionId, orgId, transactionType });

  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionId", "==", transactionId),
    where("transactionType", "==", transactionType)
  );

  const snap = await getDocs(q);
  const entries: EntryWithStatus[] = snap.docs.map((entryDoc) => {
    const { credit, debit, status, account } = entryDoc.data();

    return {
      debit,
      credit,
      status,
      account,
      entryId: entryDoc.id,
    };
  });

  return entries;
}
