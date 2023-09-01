import { doc, increment, Transaction } from 'firebase/firestore';

import { db } from '../firebase';
import { getDateDetails } from '../dates';

type Payment = {
  amount: number;
  paymentModeId: string;
};

export default function changePaymentMode(
  transaction: Transaction,
  orgId: string,
  currentPayment: Payment,
  incomingPayment: Payment
) {
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, 'organizations', orgId, 'summaries', yearMonthDay);

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
