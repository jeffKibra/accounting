import { doc, increment, Transaction } from "firebase/firestore";

import { db } from "../firebase";
import { getDateDetails } from "../dates";

export default function updatePaymentMode(
  transaction: Transaction,
  orgId: string,
  modeId: string,
  adjustment: number
) {
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  transaction.update(summaryRef, {
    [`paymentModes.${modeId}`]: increment(adjustment),
  });
}
