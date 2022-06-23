/**
 *
 * @param {transaction, orgId=''}}
 * @returns {''}
 */

import { getSummaryData } from "../summaries";

export default async function createExpenseId(transaction, orgId) {
  const summary = await getSummaryData(transaction, orgId);

  const receiptNumber = (summary?.salesReceipts || 0) + 1;
  const receiptId = `SR-${String(receiptNumber).padStart(6, 0)}`;

  return receiptId;
}
