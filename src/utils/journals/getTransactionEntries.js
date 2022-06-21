import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * @param {string} orgId
 * @param {string} transactionId
 * @param {Array.<string>} statuses
 * @returns {Promise.<{debit:0, credit:0, status:'', account:{}, entryId:"",}[]>} entries
 */
export default async function getTransactionEntries(
  orgId = "",
  transactionId = "",
  statuses = ["active"]
) {
  console.log({ transactionId, orgId });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionId", "==", transactionId),
    where("status", "in", statuses)
  );

  const snap = await getDocs(q);
  const entries = [];

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