import { Invoice } from "../../types";

export default function getInvoiceBalance(invoice: Invoice, paymentId: string) {
  const { payments, balance } = invoice;
  const payment = payments[paymentId]?.paymentAmount || 0;

  return balance + payment;
}