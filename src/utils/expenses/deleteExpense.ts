import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  deleteSimilarAccountEntries,
  groupEntriesIntoAccounts,
  getTransactionEntries,
} from "../journals";
import { getExpenseData } from ".";
import { getDateDetails } from "../dates";

import { UserProfile } from "../../types";

export default async function deleteExpense(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  expenseId: string
) {
  const { email } = userProfile;
  //   console.log({ expenseId, orgId, userProfile });

  /**
   * fetch expense data
   * fetch journal entries related to this expense
   */
  const [expenseData, allEntries] = await Promise.all([
    getExpenseData(transaction, orgId, expenseId),
    getTransactionEntries(orgId, expenseId),
  ]);
  const {
    vendor,
    paymentMode: { value: paymentModeId },
    summary: { totalAmount },
  } = expenseData;
  /**
   * group entries into accounts
   */
  const groupedEntries = groupEntriesIntoAccounts(allEntries);

  /**
   * start writing
   */

  /**
   * delete entries and update accounts summaries
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
  /**
   * update vendor summaries
   */
  if (vendor) {
    const { vendorId } = vendor;
    const vendorRef = doc(db, "organizations", orgId, "vendors", vendorId);
    transaction.update(vendorRef, {
      "summary.deletedExpenses": increment(1),
      "summary.totalExpenses": increment(0 - totalAmount),
    });
  }
  /**
   * update org counters summaries
   * since this is an expense, deletion should increase the payment mode amount
   * amount should remain +ve
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  transaction.update(summaryRef, {
    deletedExpenses: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(totalAmount),
    "cashFlow.outgoing": increment(0 - totalAmount),
  });
  /**
   * mark expense as deleted
   */
  const expenseRef = doc(db, "organizations", orgId, "expenses", expenseId);
  transaction.update(expenseRef, {
    status: "deleted",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
