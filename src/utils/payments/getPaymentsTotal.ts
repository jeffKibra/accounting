import { InvoicesPayments } from '../../types';

export default function getPaymentsTotal(payments: InvoicesPayments) {
  if (!payments) return 0;

  const invoicesIds = Object.keys(payments);
  if (invoicesIds.length === 0) return 0;

  const paymentsTotal = invoicesIds.reduce((sum, key) => {
    const rawAmount = Number(payments[key]);
    const amount = isNaN(rawAmount) ? 0 : rawAmount;
    return sum + amount;
  }, 0);

  return paymentsTotal;
}
