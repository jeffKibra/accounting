/**
 *
 * @param {{}} payments
 * @param {[]} invoices
 * @returns {[]} paidInvoices
 */

export default function selectPaidInvoices(payments, invoices) {
  return Object.keys(payments)
    .filter((invoiceId) => payments[invoiceId] > 0)
    .map((invoiceId) => {
      const invoice = invoices.find(
        (invoice) => invoice.invoiceId === invoiceId
      );
      const { customer, org, ...invoiceData } = invoice;

      return invoiceData;
    });
}
