import { doc, increment, Transaction } from "firebase/firestore";

import { db } from "../firebase";

import { getDateDetails } from "../dates";

export default function updateAccount(
  transaction: Transaction,
  orgId: string,
  accountId: string,
  adjustment: number
) {
  /**
   * get todays date to use as summary id
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  /**
   * update account summary
   */
  transaction.update(summaryRef, {
    [`accounts.${accountId}`]: increment(adjustment),
  });
}
