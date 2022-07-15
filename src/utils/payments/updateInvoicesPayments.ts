import {
  doc,
  increment,
  serverTimestamp,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";

import { UserProfile, InvoicePaymentMapping } from "../../types";

export default function updateInvoicesPayments(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  paymentId: string,
  payments: InvoicePaymentMapping[]
) {
  const { email } = userProfile;

  payments.forEach((payment) => {
    const { current, incoming, invoiceId } = payment;
    /**
     * calculate adjustment
     */
    const adjustment = incoming - current;
    // const tDetails = formats.formatInvoicePayment(formData);
    /**
     * update invoice
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    // console.log({ tDetails, incoming });
    transaction.update(invoiceRef, {
      balance: increment(0 - adjustment),
      [`payments.${paymentId}`]: incoming,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  });
}
