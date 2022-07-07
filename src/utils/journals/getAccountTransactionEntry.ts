import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 *
 * @param {string} orgId
 * @param {string} accountId
 * @param {string} transactionId
 * @param {string} transactionType
 * @param {string} status
 * @returns {Promise.<{debit:0, credit:0, account:{}, entryId:""}>} entry
 */

import { Entry } from "../../types";

export default async function getAccountTransactionEntry(
  orgId: string,
  accountId: string,
  transactionId: string,
  transactionType: string,
  status = "active"
): Promise<Entry> {
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("account.accountId", "==", accountId),
    where("transactionId", "==", transactionId),
    where("transactionType", "==", transactionType),
    where("status", "==", status),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error("Data inconsistencies detected!");
  }

  const entryDoc = snap.docs[0];
  const { credit, debit, account } = entryDoc.data();

  const entry = {
    debit,
    credit,
    account,
    entryId: entryDoc.id,
  };

  return entry;
}
