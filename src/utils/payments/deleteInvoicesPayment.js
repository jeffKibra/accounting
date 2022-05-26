import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { assetEntry } from "../journals";

export default function deleteInvoicesPayment(
  transaction,
  userProfile,
  orgId,
  paymentDetails = { paymentId: 0, invoices: [], accountId: "" },
  payments = []
) {
  const { email } = userProfile;
  const { paymentId, invoices, accountId } = paymentDetails;

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
    /**
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    //update invoice by deleting payment entry
    const invoicePayments = invoiceData.payments;
    delete invoicePayments[paymentId];
    console.log({ invoicePayments, paymentId });

    transaction.update(invoiceRef, {
      "summary.balance": increment(0 - adjustment),
      payments: invoicePayments,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });

    /**
     * update journal entries
     * debit selected account
     */
    //paymentAccount
    assetEntry.deleteEntry(
      transaction,
      userProfile,
      orgId,
      paymentAccount.entryId,
      accountId,
      { debit: paymentAccount.debit, credit: paymentAccount.credit }
    );

    //credit accounts receivable- make amount negative to credit it
    assetEntry.deleteEntry(
      transaction,
      userProfile,
      orgId,
      accountsReceivable.entryId,
      "accounts_receivable",
      {
        debit: accountsReceivable.debit,
        credit: accountsReceivable.credit,
      }
    );
  });
}
