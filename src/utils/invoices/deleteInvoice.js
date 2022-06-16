import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
} from "../journals";
import {
  getInvoiceData,
  getAllInvoiceEntries,
  getInvoicePaymentsTotal,
} from "../invoices";
import { getDateDetails } from "../dates";

export default async function deleteInvoice(
  transaction,
  orgId,
  userProfile,
  invoiceId
) {
  const { email } = userProfile;
  //   console.log({ invoiceId, orgId, userProfile });

  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const [invoiceData, allEntries] = await Promise.all([
    getInvoiceData(transaction, orgId, invoiceId),
    getAllInvoiceEntries(orgId, invoiceId),
  ]);
  /**
   * check if the invoice has payments
   */
  const paymentsTotal = getInvoicePaymentsTotal(invoiceData.payments);
  if (paymentsTotal > 0) {
    //deletion not allowed
    throw new Error(
      `Invoice Deletion Failed! You cannot delete an invoice that has payments! If you are sure you want to delete it, Please DELETE all the associated PAYMENTS first!`
    );
  }
  /**
   * group entries into accounts
   */
  const accounts = groupEntriesIntoAccounts(allEntries);

  const {
    customerId,
    summary: { totalAmount },
  } = invoiceData;

  /**
   * start writing
   */

  /**
   * delete entries and update accounts summaries
   */
  accounts.forEach((group) => {
    const { entries, ...account } = group;

    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      account,
      entries
    );
  });
  /**
   * update customer summaries
   */
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  transaction.update(customerRef, {
    "summary.deletedInvoices": increment(1),
    "summary.invoicedAmount": increment(0 - totalAmount),
  });
  /**
   * update org counters summaries
   */
  transaction.update(summaryRef, {
    deletedInvoices: increment(1),
  });
  /**
   * mark invoice as deleted
   */
  transaction.update(invoiceRef, {
    status: "deleted",
    // opius: "none",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
