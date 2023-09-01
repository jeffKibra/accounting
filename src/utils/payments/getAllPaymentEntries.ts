import { query, where, orderBy, getDocs } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Entry } from "../../types";

export default async function getAllPaymentEntries(
  orgId: string,
  paymentId: string,
  status: string = "active"
) {
  // console.log({
  //   orgId,
  //   paymentId
  //   statuses,
  // });
  console.log({ paymentId, orgId });
  const entriesCollection = dbCollections(orgId).entries;
  const q = query(
    entriesCollection,
    orderBy("createdAt", "desc"),
    where("transactionDetails.paymentId", "==", paymentId),
    where("status", "==", status)
  );

  const snap = await getDocs(q);
  const entries: Entry[] = [];

  snap.forEach((entryDoc) => {
    const { credit, debit, account } = entryDoc.data();
    entries.push({
      debit,
      credit,
      account,
      entryId: entryDoc.id,
    });
  });

  return entries;
}
