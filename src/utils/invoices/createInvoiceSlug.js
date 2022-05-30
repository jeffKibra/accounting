/**
 *
 * @param {{summary:{invoices:0}}} customer
 * @returns {''}
 */

export default function createInvoiceSlug(customer) {
  const invoiceNumber = (customer.summary?.invoices || 0) + 1;
  const invoiceSlug = `INV-${String(invoiceNumber).padStart(6, 0)}`;
  return invoiceSlug;
}
