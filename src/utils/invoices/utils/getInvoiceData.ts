import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../../firebase";

import { Invoice } from "../../../types";

export default async function getInvoiceData(
  transaction: Transaction,
  orgId: string,
  invoiceId: string
) {
  const invoicesCollection = dbCollections(orgId).invoices;

  const invoiceRef = doc(invoicesCollection, invoiceId);
  const invoiceDoc = await transaction.get(invoiceRef);
  let invoiceData = invoiceDoc.data();

  if (
    !invoiceDoc.exists ||
    invoiceDoc.data()?.status === "deleted" ||
    invoiceData === undefined
  ) {
    throw new Error(`Invoice with id ${invoiceId} not found!`);
  }

  const data: Invoice = {
    ...invoiceData,
    invoiceId,
  };

  return data;
}
