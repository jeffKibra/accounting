import { InvoicesPayments, InvoicePaymentMapping } from "../../types";

export default function getPaymentsMapping(
  payments: InvoicesPayments,
  incomingPayments: InvoicesPayments
) {
  /**
   * new array to hold all the different values
   * no duplicates
   */
  const paymentsToDelete: InvoicePaymentMapping[] = [];
  const paymentsToUpdate: InvoicePaymentMapping[] = [];
  const paymentsToCreate: InvoicePaymentMapping[] = [];
  const similarPayments: InvoicePaymentMapping[] = [];
  /**
   * are the Payment similar.
   * traverse Payment and remove similar Payment from incomingIds arrays
   * if incomingIds length is greater than zero(0)
   * traverse incomingIds and add incoming payments to unique payments object
   * keep track of current and incoming amounts in the uniquePayments array
   */
  const incomingIds = Object.keys(incomingPayments);

  Object.keys(payments).forEach((invoiceId, i) => {
    const current = payments[invoiceId];
    const incoming = incomingPayments[invoiceId] || 0;
    const dataMapping = {
      current,
      incoming,
      invoiceId,
    };
    /**
     * get index of invoice Id for incoming ids to remove it
     */
    const index = incomingIds.findIndex((id) => id === invoiceId);
    if (index > -1) {
      /**
       * similar invoice has been found
       * check if tha amounts are equal
       * if equal, add to similars array
       * else add to paymentsToUpdate array
       */
      if (current === incoming) {
        similarPayments.push(dataMapping);
      } else {
        paymentsToUpdate.push(dataMapping);
      }
      //use splice function to remove invoice from incomingIds array.
      incomingIds.splice(index, 1);
    } else {
      /**
       * invoice not in incoming payments
       * add it to paymentsToDelete
       */
      paymentsToDelete.push(dataMapping);
    }
  });
  /**
   * check if there are payments remaining in incomingIds array
   * this is a completely new payment
   * add then to paymentsToCreate array
   */
  if (incomingIds.length > 0) {
    incomingIds.forEach((invoiceId) => {
      const dataMapping = {
        current: 0,
        incoming: incomingPayments[invoiceId],
        invoiceId,
      };

      paymentsToCreate.push(dataMapping);
    });
  }

  const uniquePayments = [
    ...paymentsToCreate,
    ...paymentsToUpdate,
    ...paymentsToDelete,
    ...similarPayments,
  ];

  return {
    uniquePayments,
    similarPayments,
    paymentsToCreate,
    paymentsToUpdate,
    paymentsToDelete,
  };
}
