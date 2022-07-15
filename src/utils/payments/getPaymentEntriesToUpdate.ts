import { getInvoiceFromArray, getPaymentEntry } from ".";

import { InvoiceSummary, InvoicePaymentMapping } from "../../types";

export default async function getPaymentEntriesToUpdate(
  orgId: string,
  paymentId: string,
  invoices: InvoiceSummary[],
  accountId: string,
  payments: InvoicePaymentMapping[]
) {
  /**
   * get payment entries data to update
   */
  const entries = await Promise.all(
    payments.map(async (payment) => {
      const { invoiceId, current, incoming } = payment;
      const invoice = getInvoiceFromArray(invoiceId, invoices);

      /**
       * get customer entry data for the given account
       */
      const entry = await getPaymentEntry(
        orgId,
        paymentId,
        accountId,
        invoiceId
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
