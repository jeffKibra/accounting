import { doc } from "firebase/firestore";
import { db } from "../firebase";

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
export default async function getInvoiceData(transaction, orgId, invoiceId) {
  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
  const invoiceDoc = await transaction.get(invoiceRef);
  const invoiceData = invoiceDoc.data();

  if (!invoiceDoc.exists || invoiceData.status === "deleted") {
    throw new Error(`Invoice with id ${invoiceId} not found!`);
  }

  return {
    ...invoiceData,
    invoiceId,
  };
}
