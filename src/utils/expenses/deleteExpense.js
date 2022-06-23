import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
  getTransactionEntries,
} from "../journals";
import { getExpenseData } from ".";
import { getDateDetails } from "../dates";

export default async function deleteExpense(
  transaction,
  orgId,
  userProfile,
  salesReceiptId
) {
  const { email } = userProfile;
  //   console.log({ salesReceiptId, orgId, userProfile });

  const salesReceiptRef = doc(
    db,
    "organizations",
    orgId,
    "salesReceipts",
    salesReceiptId
  );
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  /**
   * fetch sales receipt data
   * fetch journal entries related to this sales receipt
   */
  const [salesReceiptData, allEntries] = await Promise.all([
    getExpenseData(transaction, orgId, salesReceiptId),
    getTransactionEntries(orgId, salesReceiptId),
  ]);
  const {
    customerId,
    paymentModeId,
    summary: { totalAmount },
  } = salesReceiptData;
  /**
   * group entries into accounts
   */
  const accounts = groupEntriesIntoAccounts(allEntries);

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
  if (customerId) {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    transaction.update(customerRef, {
      "summary.deletedSalesReceipts": increment(1),
      "summary.salesReceiptsAmount": increment(0 - totalAmount),
    });
  }
  /**
   * update org counters summaries
   */
  transaction.update(summaryRef, {
    deletedsalesReceipts: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(0 - totalAmount),
  });
  /**
   * mark salesReceipt as deleted
   */
  transaction.update(salesReceiptRef, {
    status: "deleted",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
