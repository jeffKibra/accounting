import { getInvoiceFromArray, getPaymentEntry } from ".";

/**
 *
 * @typedef {Object} entry
 * @property {number} credit
 * @property {number} debit
 * @property {string} entryId
 */
/**
 *
 * @typedef {Object} paymentEntry
 * @property {number} current
 * @property {number} incoming
 * @property {string} invoiceId
 * @property {Object} invoice
 * @property {entry} entry
 */
/**
 *
 * @param {string} orgId
 * @param {string} paymentId
 * @param {{}[]} invoices
 * @param {string} accountId
 * @param {{invoiceId:string, current:number, incoming:number}[]} payments
 * @returns {Promise.<paymentEntry[]>}
 */

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
