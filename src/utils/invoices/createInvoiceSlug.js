/**
 *
 * @param {{summary:{invoices:0}}} customer
 * @returns {''}
 */

import { getCountersData } from "../summaries";

export default async function createInvoiceSlug(transaction, orgId) {
  const counters = await getCountersData(transaction, orgId);

  const invoiceNumber = (counters?.invoices || 0) + 1;
  const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;
  return invoiceSlug;
}
