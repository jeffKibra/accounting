import {
  doc,
  increment,
  serverTimestamp,
  arrayUnion,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";
import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";

import {
  UserProfile,
  PaymentReceived,
  InvoicePaymentMapping,
  Account,
} from "../../types";

export default function payInvoices(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  paymentData: PaymentReceived,
  payments: InvoicePaymentMapping[],
  accounts: Account[]
) {
  const { email } = userProfile;
  const { reference, paymentId, account, paidInvoices } = paymentData;
  // console.log({ account });
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const paymentAccount = getAccountData(account.accountId, accounts);
  /**
   * map payments to invoices
   */
  const invoicesPayments = payments.map((payment) => {
    // console.log({ payment });
    const { invoiceId } = payment;

    const invoice = paidInvoices.find(
      (invoice) => invoice.invoiceId === invoiceId
    );
    if (!invoice) {
      throw new Error(`Invoice data with id ${invoiceId} not found!`);
    }

    return {
      ...payment,
      invoice,
    };
  });
  /**
   * update invoices with the current payment
   */
  invoicesPayments.forEach((payment) => {
    const { invoiceId, incoming } = payment;
    console.log({ invoiceId, incoming, paymentId });

    if (incoming > 0) {
      //update invoice
      const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
      transaction.update(invoiceRef, {
        balance: increment(0 - incoming),
        paymentsCount: increment(1),
        paymentsIds: arrayUnion(paymentId),
        [`paymentsReceived.${paymentId}`]: incoming,
        // modifiedBy: email,
        // modifiedAt: serverTimestamp(),
      });
    }
  });
  /**
   * create accountsReceivable entries
   */
  createSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    accounts_receivable,
    invoicesPayments.map((payment) => {
      const { incoming, invoice } = payment;
      const { invoiceId } = invoice;

      /**
       * accounts receivable account should be credited
       * supply amount as a negative value
       */
      return {
        amount: 0 - incoming,
        reference,
        account: accounts_receivable,
        transactionId: invoiceId,
        transactionType: "customer payment",
        transactionDetails: { ...paymentData },
      };
    })
  );
  /**
   * create deposit account entries
   */
  createSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    paymentAccount,
    invoicesPayments.map((payment) => {
      const { incoming, invoice } = payment;
      const { invoiceId } = invoice;
      /**
       * payment account should be increased
       * amount should be positive
       */
      return {
        amount: incoming,
        account: paymentAccount,
        reference,
        transactionId: invoiceId,
        transactionType: "customer payment",
        transactionDetails: { ...paymentData },
      };
    })
  );
}
