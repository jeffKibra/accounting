import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";

export default function deleteInvoicesPayments(
  transaction,
  userProfile = {},
  orgId = "",
  currentPayment = { paidInvoices: [{}], paymentId: "" },
  payments = [{ incoming: 0, current: 0, invoiceId: "" }]
) {
  const { email } = userProfile;
  const { paymentId, paidInvoices: invoices } = currentPayment;

  payments.forEach((payment) => {
    const { current, incoming, invoiceId } = payment;
    const invoice = invoices.find((inv) => inv.invoiceId === invoiceId);
    if (!invoice) {
      throw new Error(`Invoice data with id ${invoiceId} not found`);
    }
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
    const invoicePayments = invoice.payments;
    delete invoicePayments[paymentId];
    console.log({ invoicePayments, paymentId });

    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    transaction.update(invoiceRef, {
      "summary.balance": increment(0 - adjustment),
      payments: invoicePayments,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  });
}
