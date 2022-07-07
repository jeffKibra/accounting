import { Transaction } from "firebase/firestore";

import { getSummaryData } from "../summaries";

export default async function createReceiptId(
  transaction: Transaction,
  orgId: string
) {
  const summary = await getSummaryData(transaction, orgId);

  const receiptNumber = (summary?.salesReceipts || 0) + 1;
  const receiptId = `SR-${String(receiptNumber).padStart(6, "0")}`;

  return receiptId;
}
