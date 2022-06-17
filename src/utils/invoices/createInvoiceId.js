/**
 *
 * @param {transaction, orgId=""} customer
 * @returns {''}
 */

import { getSummaryData } from "../summaries";

export default async function createInvoiceId(transaction, orgId) {
  const summary = await getSummaryData(transaction, orgId);

  const invoiceNumber = (summary?.invoices || 0) + 1;
  const invoiceId = `INV-${String(invoiceNumber).padStart(6, 0)}`;

  return invoiceId;
}
