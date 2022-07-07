import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";
import { getAccountData } from "../accounts";
import {
  getPaymentsTotal,
  payInvoices,
  getPaymentsMapping,
  createPaymentId,
} from ".";
import { getCustomerData } from "../customers";
import { createSimilarAccountEntries } from "../journals";
import formats from "../formats";
import { getDateDetails } from "../dates";

import {
  Org,
  UserProfile,
  Account,
  PaymentReceivedForm,
  PaymentReceivedDetails,
} from "../../types";

export default async function createPayment(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  paymentData: PaymentReceivedForm
) {
  const orgId = org.id;
  const { email } = userProfile;
  // console.log({ data, orgId, userProfile });
  const {
    payments,
    customerId,
    amount,
    reference,
    paidInvoices,
    paymentModeId,
  } = paymentData;

  const paymentsTotal = getPaymentsTotal(payments);
  if (paymentsTotal > amount) {
    throw new Error(
      "Invoices payments cannot be more than the customer's payment!"
    );
  }
  const excess = amount - paymentsTotal;
  // console.log({ paymentsTotal, excess });

  //accounts data
  const unearned_revenue = getAccountData("unearned_revenue", accounts);
  //get payments to create formatted
  const { paymentsToCreate } = getPaymentsMapping({}, payments);

  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);

  /**
   * get current customer data.
   * dont use submitted customer as data might be outdated
   */
  const [customerData, paymentId] = await Promise.all([
    getCustomerData(transaction, orgId, customerId),
    createPaymentId(transaction, orgId),
  ]);
  /**
   * create the all inclusive payment data
   */
  const tDetails = {
    ...paymentData,
    excess,
    customer: formats.formatCustomerData(customerData),
    paidInvoices: formats.formatInvoices(paidInvoices),
    paidInvoicesIds: paidInvoices.map((invoice) => invoice.invoiceId),
  };
  const transactionDetails: PaymentReceivedDetails = {
    ...tDetails,
    paymentId,
  };
  // console.log({ transactionDetails });
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
    "cashFlow.incoming": increment(amount),
  });
  /**
   * update customer data
   * increment summary.payments counter by 1
   * increment summary.unusedCredits by the excess amount
   * increment summary.invoicePayments by the paymentsTotal amount
   */
  transaction.update(customerRef, {
    "summary.payments": increment(1),
    "summary.unusedCredits": increment(excess),
    "summary.invoicePayments": increment(paymentsTotal),
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
    transactionDetails,
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
          transactionDetails: { ...transactionDetails },
          transactionType: "customer payment",
        },
      ]
    );
  }
  /**
   * create new payment
   */
  const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);
  transaction.set(paymentRef, {
    ...tDetails,
    status: "active",
    org: formats.formatOrgData(org),
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
