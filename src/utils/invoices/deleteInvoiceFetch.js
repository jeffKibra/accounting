import { groupEntriesIntoAccounts, getTransactionEntries } from "../journals";
import { getInvoiceData, getInvoicePaymentsTotal } from ".";

/**
 *
 * @typedef {import('.').invoice} invoice
 * @typedef {import('../journals').entriesGroup} entriesGroup
 * @typedef {import('firebase/firestore').Transaction} transaction
 */
/**
 *
 * @typedef {object} deleteInvoiceData
 * @property {entriesGroup[]} groupedEntries
 * @property {invoice} invoice
 */
/**
 *{deleteInvoiceData} deleteInvoiceData
 * @param {transaction} transaction
 * @param {string} orgId
 * @param {string} invoiceId
 * @returns
 */
export default async function deleteInvoiceFetch(
  transaction,
  orgId,
  invoiceId
) {
  const [invoice, allEntries] = await Promise.all([
    getInvoiceData(transaction, orgId, invoiceId),
    getTransactionEntries(orgId, invoiceId),
  ]);
  console.log({ allEntries });
  /**
   * check if the invoice has payments
   */
  const paymentsTotal = getInvoicePaymentsTotal(invoice.payments);
  if (paymentsTotal > 0) {
    //deletion not allowed
    throw new Error(
      `Invoice Deletion Failed! You cannot delete an invoice that has payments! If you are sure you want to delete it, Please DELETE all the associated PAYMENTS first!`
    );
  }
  /**
   * group entries into accounts
   */
  const groupedEntries = groupEntriesIntoAccounts(allEntries);

  return {
    groupedEntries,
    invoice,
  };
}
