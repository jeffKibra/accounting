import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { assetEntry } from "../journals";

export default function updateInvoicesPayment(
  transaction,
  userProfile,
  orgId,
  payment,
  incomingPayment,
  payments
) {
  const { email } = userProfile;
  const { accountId } = payment;
  const { invoices, paymentId } = incomingPayment;

  payments.forEach((payment) => {
    const { current, incoming, invoiceId, accountsReceivable, paymentAccount } =
      payment;
    const invoice = invoices.find((inv) => inv.invoiceId === invoiceId);
    if (!invoice) {
      throw new Error(`Invoice data with id ${invoiceId} not found`);
    }
    const { ...invoiceData } = invoice;
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);

    /**
     * calculate adjustment
     */
    const adjustment = incoming - current;
    //update invoice
    const { customer, org, ...tDetails } = incomingPayment;
    /**
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    //update invoice
    transaction.update(invoiceRef, {
      "summary.balance": increment(0 - adjustment),
      payments: {
        ...invoiceData.payments,
        [paymentId]: {
          paymentAmount: incoming,
          ...tDetails,
        },
      },
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });

    /**
     * update journal entries
     * debit selected account
     */
    //paymentAccount
    assetEntry.updateEntry(
      transaction,
      userProfile,
      orgId,
      accountId,
      paymentAccount.entryId,
      incoming,
      {
        debit: paymentAccount.debit,
        credit: paymentAccount.credit,
      }
    );

    //credit accounts receivable- make amount negative to credit it
    assetEntry.updateEntry(
      transaction,
      userProfile,
      orgId,
      "accounts_receivable",
      accountsReceivable.entryId,
      0 - incoming,
      {
        debit: accountsReceivable.debit,
        credit: accountsReceivable.credit,
      }
    );
  });
}
