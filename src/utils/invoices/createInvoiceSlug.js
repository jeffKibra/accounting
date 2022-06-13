/**
 *
 * @param {{summary:{invoices:0}}} customer
 * @returns {''}
 */

import { getSummaryData } from "../summaries";

export default async function createInvoiceSlug(transaction, orgId) {
  const summary = await getSummaryData(transaction, orgId);

  const invoiceNumber = (summary?.invoices || 0) + 1;
  const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;

  return invoiceSlug;
}
