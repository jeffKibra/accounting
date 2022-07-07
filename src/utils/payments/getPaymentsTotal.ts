import { PaymentsToInvoices } from "../../types";

export default function getPaymentsTotal(payments: PaymentsToInvoices) {
  if (!payments) return 0;

  const invoicesIds = Object.keys(payments);
  if (invoicesIds.length === 0) return 0;

  const paymentsTotal = invoicesIds.reduce((sum, key) => {
    return sum + +payments[key];
  }, 0);

  return paymentsTotal;
}
