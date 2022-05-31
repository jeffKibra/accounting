import {
  doc,
  increment,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";

import { db } from "../firebase";

export default function deleteInvoicesPayments(
  transaction,
  userProfile = {},
  orgId = "",
  currentPayment = { paidInvoices: [{}], paymentId: "" },
  payments = [{ incoming: 0, current: 0, invoiceId: "" }]
) {
  const { email } = userProfile;
  const { paymentId } = currentPayment;

  payments.forEach((payment) => {
    const { current, incoming, invoiceId } = payment;
    /**
     * calculate adjustment
     */
    const adjustment = incoming - current;
    /**
     * update invoice
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    transaction.update(invoiceRef, {
      "summary.balance": increment(0 - adjustment),
      [`payments.${paymentId}`]: deleteField(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  });
}
