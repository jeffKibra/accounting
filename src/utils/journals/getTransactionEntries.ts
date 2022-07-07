import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * @param {string} orgId
 * @param {string} transactionId
 * @param {Array.<string>} statuses
 * @returns {Promise.<{debit:0, credit:0, status:'', account:{}, entryId:"",}[]>} entries
 */

import { EntryWithStatus } from "../../types";

export default async function getTransactionEntries(
  orgId: string,
  transactionId: string,
  statuses: string[] = ["active"]
) {
  console.log({ transactionId, orgId });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionId", "==", transactionId),
    where("status", "in", statuses)
  );

  const snap = await getDocs(q);
  const entries: EntryWithStatus[] = [];

  snap.forEach((entryDoc) => {
    const { credit, debit, status, account } = entryDoc.data();
    entries.push({
      debit,
      credit,
      status,
      account,
      entryId: entryDoc.id,
    });
  });

  return entries;
}
