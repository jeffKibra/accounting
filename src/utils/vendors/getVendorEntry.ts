import { query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Entry } from "../../types";

export default async function getOpeningBalanceEntries(
  orgId: string,
  vendorId: string,
  accountId: string,
  transactionType: string,
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
    where("transactionId", "==", vendorId),
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
    entryId,
    credit,
    debit,
    account,
  };

  return entry;
}
