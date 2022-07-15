import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";
import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
  getTransactionEntries,
} from "../journals";
import { getSalesReceiptData } from ".";
import { getDateDetails } from "../dates";

import { UserProfile } from "../../types";

export default async function deleteSalesReceipt(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  salesReceiptId: string
) {
  const { email } = userProfile;
  //   console.log({ salesReceiptId, orgId, userProfile });

  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  /**
   * fetch sales receipt data
   * fetch journal entries related to this sales receipt
   */
  const [salesReceiptData, allEntries] = await Promise.all([
    getSalesReceiptData(transaction, orgId, salesReceiptId),
    getTransactionEntries(orgId, salesReceiptId),
  ]);
  const {
    customer: { customerId },
    paymentMode: { value: paymentModeId },
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
  const adjustment = 0 - +totalAmount;
  transaction.update(summaryRef, {
    deletedsalesReceipts: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(adjustment),
    "cashFlow.incoming": increment(adjustment),
  });
  /**
   * mark salesReceipt as deleted
   */
  const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
  const salesReceiptRef = doc(salesReceiptsCollection, salesReceiptId);
  transaction.update(salesReceiptRef, {
    status: "deleted",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
