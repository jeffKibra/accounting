import { doc, increment, arrayUnion, Transaction } from "firebase/firestore";

import { db } from "../firebase";
import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";

import {
  UserProfile,
  InvoicePaymentMapping,
  Account,
  PaymentReceivedForm,
} from "../../types";

interface PaymentData extends PaymentReceivedForm {
  paymentId: string;
}

export default function payInvoices(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  paymentData: PaymentData,
  mappedPayments: InvoicePaymentMapping[],
  accounts: Account[]
) {
  const { reference, paymentId, account } = paymentData;
  // console.log({ account });
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const paymentAccount = getAccountData(account.accountId, accounts);

  /**
   * update invoices with the current payment
   */
  mappedPayments.forEach((payment) => {
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
    mappedPayments.map((payment) => {
      const { incoming, invoiceId } = payment;

      /**
       * accounts receivable account should be credited
       * supply amount as a negative value
       */
      return {
        amount: 0 - incoming,
        reference,
        account: accounts_receivable,
        transactionId: invoiceId,
        transactionType: "invoice_payment",
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
    mappedPayments.map((payment) => {
      const { incoming, invoiceId } = payment;
      /**
       * payment account should be increased
       * amount should be positive
       */
      return {
        amount: incoming,
        account: paymentAccount,
        reference,
        transactionId: invoiceId,
        transactionType: "invoice_payment",
        transactionDetails: { ...paymentData },
      };
    })
  );
}
