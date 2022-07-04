export default function getInvoiceBalance(
  invoice = { payments: {}, balance: 0 },
  paymentId = ""
) {
  const { payments, balance } = invoice;
  const payment = payments[paymentId]?.paymentAmount || 0;

  return balance + payment;
}
