import { doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getSalesReceiptData(
  transaction,
  orgId,
  salesReceiptId
) {
  const salesReceiptRef = doc(
    db,
    "organizations",
    orgId,
    "salesReceipts",
    salesReceiptId
  );
  const salesReceiptDoc = await transaction.get(salesReceiptRef);
  const salesReceiptData = salesReceiptDoc.data();

  if (!salesReceiptDoc.exists || salesReceiptData.status === "deleted") {
    throw new Error(`Sales Receipt with id ${salesReceiptId} not found!`);
  }

  return {
    ...salesReceiptData,
    salesReceiptId,
  };
}
