import { getCustomerEntryData } from "../journals";

export default async function getPaymentEntriesToUpdate(
  orgId = "",
  customerId = "",
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
      const invoice = invoices.find((inv) => inv.invoiceId === invoiceId);

      if (!invoice) {
        return Promise.reject(
          `Payment data for invoice with id ${invoiceId} not found!`
        );
      }
      const { invoiceSlug } = invoice;
      /**
       * get customer entry data for the given account
       */
      const entry = await getCustomerEntryData(
        orgId,
        customerId,
        accountId,
        invoiceSlug,
        "customer payment"
      );

      return {
        current,
        incoming,
        invoiceId,
        entry,
      };
    })
  );

  return entries;
}
