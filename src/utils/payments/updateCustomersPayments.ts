import {
  doc,
  increment,
  serverTimestamp,
  Transaction,
} from 'firebase/firestore';

import { db } from '../firebase';
import getPaymentsTotal from './getPaymentsTotal';

import { UserProfile, PaymentReceivedForm, PaymentReceived } from '../../types';

export default function updateCustomersPayments(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  payment: PaymentReceived,
  incomingPayment: PaymentReceivedForm
) {
  const { email } = userProfile;
  const {
    customer: { id: customerId },
    amount,
    payments,
  } = payment;
  const {
    customer: { id: incomingCustomerId },
    amount: incomingAmount,
    payments: incomingPayments,
  } = incomingPayment;

  const customerRef = doc(db, 'organizations', orgId, 'customers', customerId);
  const incomingCustomerRef = doc(
    db,
    'organizations',
    orgId,
    'customers',
    incomingCustomerId
  );

  //check is customer has changed
  const customerHasChanged = customerId !== incomingCustomerId;

  const paymentsTotal = getPaymentsTotal(payments);
  const excess = amount - paymentsTotal;

  const incomingPaymentsTotal = getPaymentsTotal(incomingPayments);
  const incomingExcess = incomingAmount - incomingPaymentsTotal;

  if (customerHasChanged) {
    /**
     * updates to current customer
     * subtract excess and payments total
     * increase numbers of deleted payments
     */
    transaction.update(customerRef, {
      'summary.deletedPayments': increment(1),
      'summary.unusedCredits': increment(0 - excess),
      'summary.invoicePayments': increment(0 - paymentsTotal),
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });
    /**
     * updates to incoming customer
     * increase excess and payments total
     * increment number of customer payments
     */
    transaction.update(incomingCustomerRef, {
      'summary.payments': increment(1),
      'summary.unusedCredits': increment(incomingExcess),
      'summary.invoicePayments': increment(incomingPaymentsTotal),
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });
  } else {
    /**
     * update excess and paymentsTotal amounts
     * calculate adjustments to update with
     */
    const excessAdjustment = incomingExcess - excess;
    const paymentsTotalAdjustment = incomingPaymentsTotal - paymentsTotal;

    transaction.update(incomingCustomerRef, {
      'summary.unusedCredits': increment(excessAdjustment),
      'summary.invoicePayments': increment(paymentsTotalAdjustment),
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });
  }
}
