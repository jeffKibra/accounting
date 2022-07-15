import { query, where, orderBy, getDocs } from "firebase/firestore";
import { dbCollections } from "../../firebase";
import { Entry } from "../../../types";

export default async function getAllInvoiceEntries(
  orgId: string,
  invoiceId: string,
  status: string = "active"
) {
  const journalsCollection = dbCollections(orgId).entries;
  // console.log({
  //   orgId,
  //   paymentId
  //   statuses,
  // });
  console.log({ invoiceId, orgId });
  const q = query(
    journalsCollection,
    orderBy("createdAt", "desc"),
    where("transactionDetails.invoiceId", "==", invoiceId),
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
