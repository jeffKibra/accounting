import { getInvoiceFromArray, getPaymentEntry } from ".";

export default async function getPaymentEntriesToUpdate(
  orgId = "",
  paymentId = "",
  invoices = [],
  accountId = "",
  payments = [{ invoiceId: "", current: 0, incoming: 0 }]
) {
  /**
   * get payment entries data to update
   */
  const entries = await Promise.all(
    payments.map(async (payment) => {
      const { invoiceId, current, incoming } = payment;
      const invoice = getInvoiceFromArray(invoiceId, invoices);

      const { invoiceSlug } = invoice;
      /**
       * get customer entry data for the given account
       */
      const entry = await getPaymentEntry(
        orgId,
        paymentId,
        accountId,
        invoiceSlug
      );

      return {
        current,
        incoming,
        invoiceId,
        entry,
        invoice,
      };
    })
  );

  return entries;
}
