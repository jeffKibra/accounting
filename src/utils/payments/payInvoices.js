import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { assetEntry } from "../journals";
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
  const { reference, paymentId, accountId, paidInvoices } = transactionDetails;
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const paymentAccount = getAccountData(accountId, accounts);

  payments.forEach((payment) => {
    const { invoiceId, incoming } = payment;
    const invoice = paidInvoices.find(
      (invoice) => invoice.invoiceId === invoiceId
    );

    if (!invoice) {
      throw new Error(`Invoice data with id ${invoiceId} not found!`);
    }

    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);

    if (incoming > 0) {
      //update invoice
      const {
        customer,
        org,
        paidInvoices: inv,
        ...tDetails
      } = transactionDetails;

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

      const { invoiceSlug } = invoice;

      /**
       * create journal entries
       * debit selected account
       */
      assetEntry.newEntry(
        transaction,
        userProfile,
        orgId,
        paymentAccount.accountId,
        {
          amount: incoming,
          account: paymentAccount,
          reference,
          transactionId: invoiceSlug,
          transactionType: "customer payment",
          transactionDetails,
        }
      );
      //credit accounts receivable- make amount negative to credit it
      assetEntry.newEntry(
        transaction,
        userProfile,
        orgId,
        accounts_receivable.accountId,
        {
          amount: 0 - incoming,
          reference,
          account: accounts_receivable,
          transactionId: invoiceSlug,
          transactionType: "customer payment",
          transactionDetails,
        }
      );
    }
  });
}
