import {
  groupEntriesIntoAccounts,
  getTransactionEntries,
} from "../../journals";
import { getInvoiceData, getInvoicePaymentsTotal } from "..";

import { Transaction } from "firebase/firestore";

export default async function fetchInvoiceDeletionData(
  transaction: Transaction,
  orgId: string,
  invoiceId: string
) {
  const [invoice] = await Promise.all([
    getInvoiceData(transaction, orgId, invoiceId),
  ]);
  const allEntries = await getTransactionEntries(
    orgId,
    invoiceId,
    invoice.transactionType
  );

  console.log({ allEntries });
  /**
   * check if the invoice has payments
   */
  const paymentsTotal = getInvoicePaymentsTotal(invoice.paymentsReceived || {});
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
