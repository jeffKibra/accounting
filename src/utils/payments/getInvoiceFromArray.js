/**
 *
 * @param {""} invoiceId
 * @param {[{invoiceId, invoiceSlug}]} invoices
 * @returns {{invoiceId, invoiceSlug}}
 */

export default function getInvoiceFromArray(invoiceId = "", invoices = []) {
  const invoice = invoices.find((invoice) => invoice.invoiceId === invoiceId);

  if (!invoice) throw new Error(`Invoice data with id ${invoiceId} not found!`);

  return invoice;
}
