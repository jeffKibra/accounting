import {
  doc,
  increment,
  serverTimestamp,
  deleteField,
  arrayRemove,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  UserProfile,
  PaymentReceived,
  InvoicePaymentMapping,
} from "../../types";

export default function deleteInvoicesPayments(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  currentPayment: PaymentReceived,
  payments: InvoicePaymentMapping[]
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
      balance: increment(0 - adjustment),
      paymentsCount: increment(-1),
      paymentsIds: arrayRemove(paymentId),
      [`paymentsReceived.${paymentId}`]: deleteField(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  });
}
