import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export default async function getOpeningBalanceEntry(
  orgId = "",
  customerId = "",
  accountId = "",
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
    where("transactionId", "==", customerId),
    where("account.accountId", "==", accountId),
    where("transactionType", "==", "customer opening balance"),
    where("status", "in", statuses),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const entryDoc = snap.docs[0];
  const entryId = entryDoc.id;
  const { credit, debit, status } = entryDoc.data();

  return {
    credit,
    debit,
    entryId,
    status,
  };
}
