/**
 *
 * @param {{summary:{payments:0}}} customer
 * @returns {""}
 */

import { getSummaryData } from "../summaries";

export default async function createPaymentSlug(transaction, orgId) {
  const summary = await getSummaryData(transaction, orgId);

  const paymentNumber = (summary?.payments || 0) + 1;
  const paymentSlug = `PR-${String(paymentNumber).padStart(6, 0)}`;

  return paymentSlug;
}
