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
 * @param {""} orgId
 * @param {""} vendorId
 * @param {""} accountId
 * @param {""} transactionType
 * @param {[""]} statuses
 * @returns {{entryId,credit,debit,account,status}} entry
 */
export default async function getOpeningBalanceEntries(
  orgId = "",
  vendorId = "",
  accountId = "",
  transactionType = "",
  statuses = ["active"]
) {
  // console.log({
  //   transactionType,
  //   orgId,
  //   accountId,
  //   paymentId,
  //   transactionId,
  //   statuses,
  // });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionId", "==", vendorId),
    where("account.accountId", "==", accountId),
    where("transactionType", "==", transactionType),
    where("status", "in", statuses),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const entryDoc = snap.docs[0];
  const entryId = entryDoc.id;
  const { credit, debit, status, account } = entryDoc.data();

  return {
    entryId,
    credit,
    debit,
    account,
    status,
  };
}
