import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../../firebase";
import { deleteSimilarAccountEntries } from "../../journals";
import { getDateDetails } from "../../dates";

import { UserProfile, Invoice, GroupedEntries } from "../../../types";

export default function deleteInvoice(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  invoice: Invoice,
  groupedEntries: GroupedEntries,
  deletionType: string = "mark"
) {
  const {
    invoiceId,
    customer: { customerId },
    summary: { totalAmount },
    transactionType,
  } = invoice;
  /**
   * delete entries and update groupedEntries summaries
   */
  Object.values(groupedEntries).forEach((entries) => {
    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      entries[0].account,
      entries
    );
  });
  if (transactionType === "invoice") {
    /**
     * update customer summaries
     */
    const customersCollection = dbCollections(orgId).customers;
    const customerRef = doc(customersCollection, customerId);
    transaction.update(customerRef, {
      "summary.deletedInvoices": increment(1),
      "summary.invoicedAmount": increment(0 - totalAmount),
    });

    /**
     * update org counters summaries
     */
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    transaction.update(summaryRef, {
      deletedInvoices: increment(1),
    });
  }

  /**
   * delete invoice
   */
  const invoicesCollection = dbCollections(orgId).invoices;
  const invoiceRef = doc(invoicesCollection, invoiceId);
  /**
   * check if invoice should be deleted
   */
  if (deletionType === "mark") {
    /**
     * mark invoice as deleted
     */
    console.log("marking");
    const { email } = userProfile;
    transaction.update(invoiceRef, {
      status: "deleted",
      // opius: "none",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  } else {
    console.log("deleting invoice");
    transaction.delete(invoiceRef);
  }
}