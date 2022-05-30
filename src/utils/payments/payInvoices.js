import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { createSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";

export default function payInvoices(
  transaction,
  userProfile,
  orgId,
  transactionDetails,
  payments = [{ current: 0, incoming: 0, invoiceId: "" }],
  accounts
) {
  const { email } = userProfile;
  const { reference, paymentId, account, paidInvoices, paymentSlug } =
    transactionDetails;
  console.log({ account });
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const paymentAccount = getAccountData(account.accountId, accounts);
  /**
   * map payments to invoices
   */
  const invoicesPayments = payments.map((payment) => {
    console.log({ payment });
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
    const { invoice, invoiceId, incoming } = payment;

    if (incoming > 0) {
      //update invoice
      const {
        customer,
        org,
        paidInvoices: inv,
        ...tDetails
      } = transactionDetails;

      const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
      transaction.update(invoiceRef, {
        "summary.balance": increment(0 - incoming),
        payments: {
          ...invoice.payments,
          [paymentId]: {
            paymentAmount: incoming,
            ...tDetails,
          },
        },
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
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
      const { incoming } = payment;
      /**
       * accounts receivable account should be credited
       * supply amount as a negative value
       */
      return {
        amount: 0 - incoming,
        reference,
        account: accounts_receivable,
        transactionId: paymentSlug,
        transactionType: "customer payment",
        transactionDetails,
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
      const { incoming } = payment;
      /**
       * payment account should be increased
       * amount should be positive
       */
      return {
        amount: incoming,
        account: paymentAccount,
        reference,
        transactionId: paymentSlug,
        transactionType: "customer payment",
        transactionDetails,
      };
    })
  );
}
