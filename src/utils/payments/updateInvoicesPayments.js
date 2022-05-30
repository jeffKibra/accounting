import { doc, increment, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import formats from "../formats";

export default function updateInvoicesPayments(
  transaction,
  userProfile = {},
  orgId = "",
  incomingPayment = { paidInvoices: [{}] },
  payments = [{ current: 0, incoming: 0, invoiceId: "" }]
) {
  const { email } = userProfile;
  const { paidInvoices: invoices, paymentId } = incomingPayment;

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
    const tDetails = formats.formatInvoicePayment(incomingPayment);
    /**
     * update invoice
     * subtract adjustment from zero(0) before incrementing to invert the sign
     * NB::: when payment increases, balance reduces and vise versa
     */
    const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
    console.log({ tDetails, incoming });
    transaction.update(invoiceRef, {
      "summary.balance": increment(0 - adjustment),
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
  });
}
