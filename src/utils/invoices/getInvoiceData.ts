import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

/**
 *
 * @typedef {import('firebase/firestore').Transaction} transaction
 * @typedef {import('.').invoice} invoice
 */
/**
 *
 * @param {transaction} transaction
 * @param {string} orgId
 * @param {string} invoiceId
 * @returns {Promise.<invoice>} Promise<invoice>
 */

import { Invoice } from "../../types";

export default async function getInvoiceData(
  transaction: Transaction,
  orgId: string,
  invoiceId: string
) {
  const invoicesCollection = dbCollections(orgId).invoices;

  const invoiceRef = doc(invoicesCollection, invoiceId);
  const invoiceDoc = await transaction.get(invoiceRef);
  let invoiceData = invoiceDoc.data();

  if (
    !invoiceDoc.exists ||
    invoiceDoc.data()?.status === "deleted" ||
    invoiceData === undefined
  ) {
    throw new Error(`Invoice with id ${invoiceId} not found!`);
  }

  const data: Invoice = {
    ...invoiceData,
    invoiceId,
  };

  return data;
}
