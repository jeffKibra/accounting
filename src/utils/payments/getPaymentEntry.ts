import { query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Entry } from "../../types";

export default async function getPaymentEntry(
  orgId: string,
  paymentId: string,
  accountId: string,
  transactionId: string,
  transactionType: string = "customer payment",
  status: string = "active"
) {
  // console.log({
  //   transactionType,
  //   orgId,
  //   accountId,
  //   paymentId,
  //   transactionId,
  //   statuses,
  // });
  const entriesCollection = dbCollections(orgId).entries;
  const q = query(
    entriesCollection,
    orderBy("createdAt", "desc"),
    where("transactionDetails.paymentId", "==", paymentId),
    where("transactionId", "==", transactionId),
    where("account.accountId", "==", accountId),
    where("transactionType", "==", transactionType),
    where("status", "==", status),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const entryDoc = snap.docs[0];
  const entryId = entryDoc.id;
  const { credit, debit, account } = entryDoc.data();

  const entry: Entry = {
    credit,
    debit,
    entryId,
    account,
  };

  return entry;
}
