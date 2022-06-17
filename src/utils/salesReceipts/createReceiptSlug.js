/**
 *
 * @param {transaction, orgId=''}}
 * @returns {''}
 */

import { getSummaryData } from "../summaries";

export default async function createReceiptSlug(transaction, orgId) {
  const summary = await getSummaryData(transaction, orgId);

  const receiptNumber = (summary?.salesReceipts || 0) + 1;
  const receiptSlug = `SR-${String(receiptNumber).padStart(6, 0)}`;

  return receiptSlug;
}
