import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default async function getAllInvoiceEntries(
  orgId = "",
  invoiceId = "",
  statuses = ["active"]
) {
  // console.log({
  //   orgId,
  //   paymentId
  //   statuses,
  // });
  console.log({ invoiceId, orgId });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionDetails.invoiceId", "==", invoiceId),
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
