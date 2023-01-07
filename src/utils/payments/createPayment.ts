import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
  Timestamp,
} from 'firebase/firestore';

import { db, dbCollections } from '../firebase';
import { getAccountData } from '../accounts';
import {
  getPaymentsTotal,
  payInvoices,
  getPaymentsMapping,
  createPaymentId,
} from '.';
import { createSimilarAccountEntries } from '../journals';
import formats from '../formats';
import { getDateDetails } from '../dates';

import {
  Org,
  UserProfile,
  Account,
  PaymentReceivedForm,
  PaymentReceived,
  TransactionTypes,
} from '../../types';

export default async function createPayment(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  formData: PaymentReceivedForm,
  transactionType: keyof Pick<
    TransactionTypes,
    'customer_payment'
  > = 'customer_payment'
) {
  console.log({ formData });
  const { orgId } = org;
  const { email } = userProfile;
  // console.log({ data, orgId, userProfile });
  const { payments, customer, amount, reference, paymentMode } = formData;
  const { id: customerId } = customer;
  const { value: paymentModeId } = paymentMode;

  const paymentsTotal = getPaymentsTotal(payments);
  if (paymentsTotal > amount) {
    throw new Error(
      "Invoices payments cannot be more than the customer's payment!"
    );
  }
  const excess = amount - paymentsTotal;
  // console.log({ paymentsTotal, excess });

  //accounts data
  const unearned_revenue = getAccountData('unearned_revenue', accounts);
  //get payments to create formatted
  const { paymentsToCreate } = getPaymentsMapping({}, payments);

  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, 'organizations', orgId, 'summaries', yearMonthDay);
  const customerRef = doc(db, 'organizations', orgId, 'customers', customerId);

  /**
   * get current customer data.
   * dont use submitted customer as data might be outdated
   */
  const [paymentId] = await Promise.all([createPaymentId(transaction, orgId)]);
  /**
   * create the all inclusive payment data
   */
  const paymentData: PaymentReceived = {
    ...formData,
    excess,
    paidInvoicesIds: Object.keys(payments),
    paymentId,
    transactionType,
    status: 'active',
    org: formats.formatOrgData(org),
    createdBy: email,
    createdAt: serverTimestamp() as Timestamp,
    modifiedBy: email,
    modifiedAt: serverTimestamp() as Timestamp,
  };
  // console.log({ paymentData });
  /**
   * start docs writing!
   */

  /**
   * increment orgs counter for payments by one(1)
   * update paymentModes in summary
   */
  transaction.update(summaryRef, {
    payments: increment(1),
    [`paymentModes.${paymentModeId}`]: increment(amount),
    'cashFlow.incoming': increment(amount),
  });
  /**
   * update customer data
   * increment summary.payments counter by 1
   * increment summary.unusedCredits by the excess amount
   * increment summary.invoicePayments by the paymentsTotal amount
   */
  transaction.update(customerRef, {
    'summary.payments': increment(1),
    'summary.unusedCredits': increment(excess),
    'summary.invoicePayments': increment(paymentsTotal),
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
  /**
   * make the needed invoice payments
   */
  payInvoices(
    transaction,
    userProfile,
    orgId,
    paymentData,
    paymentsToCreate,
    accounts
  );
  /**
   * excess amount - credit account with the excess amount
   */
  if (excess > 0) {
    createSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      unearned_revenue,
      [
        {
          account: unearned_revenue,
          amount: excess,
          reference,
          transactionId: paymentId,
          transactionDetails: { ...paymentData },
          transactionType: 'customer_payment',
        },
      ]
    );
  }
  /**
   * create new payment
   */
  const paymentsReceivedCollection = dbCollections(orgId).paymentsReceived;
  const paymentRef = doc(paymentsReceivedCollection, paymentId);
  const { paymentId: pid, ...tDetails } = paymentData;
  console.log({ tDetails });
  transaction.set(paymentRef, {
    ...tDetails,
  });
}
