import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import { getDateDetails } from "../dates";

export default function changePaymentMode(
  transaction,
  orgId,
  currentPayment = { amount: 0, paymentModeId: "" },
  incomingPayment = { amount: 0, paymentModeId: "" }
) {
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const { amount, paymentModeId } = currentPayment;
  const { amount: incomingAmount, paymentModeId: incomingModeId } =
    incomingPayment;
  /**
   * subtract current amount from current mode
   * add incoming amount to incoming mode
   */
  transaction.update(summaryRef, {
    [`paymentModes.${paymentModeId}`]: increment(0 - amount),
    [`paymentModes.${incomingModeId}`]: increment(incomingAmount),
  });
}
