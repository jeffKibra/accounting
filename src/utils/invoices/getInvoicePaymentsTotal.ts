import { InvoicePayments } from "../../types";

export default function getInvoicePaymentsTotal(payments: InvoicePayments) {
  return Object.keys(payments).reduce((sum, key) => {
    return sum + +payments[key].paymentAmount;
  }, 0);
}
