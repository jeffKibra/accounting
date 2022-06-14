import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import { getDateDetails } from "../dates";

export default function updatePaymentMode(
  transaction,
  orgId,
  modeId,
  adjustment
) {
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  transaction.update(summaryRef, {
    [`paymentModes.${modeId}`]: increment(adjustment),
  });
}
