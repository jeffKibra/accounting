import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { SalesReceipt } from "../../types";

export default async function getSalesReceiptData(
  transaction: Transaction,
  orgId: string,
  salesReceiptId: string
): Promise<SalesReceipt> {
  const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
  const salesReceiptRef = doc(salesReceiptsCollection, salesReceiptId);
  const salesReceiptDoc = await transaction.get(salesReceiptRef);
  const salesReceiptData = salesReceiptDoc.data();

  if (
    !salesReceiptDoc.exists ||
    !salesReceiptData ||
    salesReceiptData.status === "deleted"
  ) {
    throw new Error(`Sales Receipt with id ${salesReceiptId} not found!`);
  }

  return {
    ...salesReceiptData,
    salesReceiptId,
  };
}
