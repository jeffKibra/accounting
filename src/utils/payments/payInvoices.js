import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { assetEntry } from "../journals";
import { getAccountData } from "../accounts";

export default function payInvoices(
  transaction,
  userProfile,
  orgId,
  transactionDetails,
  accounts
) {
  const { email } = userProfile;
  const { reference, paymentId, accountId, invoices, payments } =
    transactionDetails;
  const accounts_receivable = getAccountData("accounts_receivable", accounts);
  const paymentAccount = getAccountData(accountId, accounts);

  Object.keys(payments).forEach((invoiceId) => {
    const invoice = invoices.find((invoice) => invoice.invoiceId === invoiceId);

    if (!invoice) {
      throw new Error(`Invoice data with id ${invoiceId} not found!`);
    }

    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    const paymentAmount = payments[invoiceId];
    console.log({ paymentAmount });

    if (paymentAmount > 0) {
      //update invoice
      const { customer, org, invoices: inv, ...tDetails } = transactionDetails;
      transaction.update(invoiceRef, {
        "summary.balance": increment(0 - paymentAmount),
        payments: {
          ...invoice.payments,
          [paymentId]: {
            paymentAmount,
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
          amount: paymentAmount,
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
          amount: 0 - paymentAmount,
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
