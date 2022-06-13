import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";

import { getDateDetails } from "../dates";

export default function updateAccount(
  transaction,
  orgId,
  accountId,
  adjustment
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
