import {
  doc,
  increment,
  serverTimestamp,
  Transaction,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  UserProfile,
  InvoicePaymentMapping,
  PaymentReceivedFormWithId,
} from "../../types";

export default function updateInvoicesPayments(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  incomingPayment: PaymentReceivedFormWithId,
  payments: InvoicePaymentMapping[]
) {
  const { email } = userProfile;
  const { paymentId } = incomingPayment;

  payments.forEach((payment) => {
    const { current, incoming, invoiceId } = payment;
    /**
     * calculate adjustment
     */
    const adjustment = incoming - current;
    // const tDetails = formats.formatInvoicePayment(incomingPayment);
    /**
     * update invoice
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    // console.log({ tDetails, incoming });
    transaction.update(invoiceRef, {
      balance: increment(0 - adjustment),
      [`payments.${paymentId}`]: {
        paymentAmount: incoming,
        ...incomingPayment,
      },
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  });
}
