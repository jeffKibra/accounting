import { getCustomerEntryData } from "../journals";

export default async function getPaymentEntriesToUpdate(
  orgId = "",
  payment = {
    customerId: "",
    invoices: [],
    accountId: "",
  },
  payments = []
) {
  /**
   * get items to update
   *
   */

  const { customerId, invoices, accountId } = payment;

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
       * 2 journal entries per invoice payment
       * 1. accounts_receivable entry
       * 2. paymentAccount entry
       */
      const [accountsReceivable, paymentAccount] = await Promise.all([
        getCustomerEntryData(
          orgId,
          customerId,
          "accounts_receivable",
          invoiceSlug,
          "customer payment"
        ),
        getCustomerEntryData(
          orgId,
          customerId,
          accountId,
          invoiceSlug,
          "customer payment"
        ),
      ]);

      return {
        current,
        incoming,
        invoiceId,
        accountsReceivable,
        paymentAccount,
      };
    })
  );

  return entries;
}
