import { InvoicePayments } from "../../../types";

export default function getInvoicePaymentsTotal(payments: InvoicePayments) {
  return Object.keys(payments).reduce((sum: number, key) => {
    return sum + +payments[key];
  }, 0);
}
