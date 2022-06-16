export default function getInvoicePaymentsTotal(payments) {
  return Object.keys(payments).reduce((sum, key) => {
    return sum + +payments[key].paymentAmount;
  }, 0);
}
