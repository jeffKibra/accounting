/**
 *
 * @param {{summary:{payments:0}}} customer
 * @returns {""}
 */

import { getCountersData } from "../summaries";

export default async function createPaymentSlug(transaction, orgId) {
  const counters = await getCountersData(transaction, orgId);

  const paymentNumber = (counters?.payments || 0) + 1;
  const paymentSlug = `PR-${String(paymentNumber).padStart(6, 0)}`;

  return paymentSlug;
}
