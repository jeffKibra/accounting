import { InvoicesPayments } from '../../types';

export default function getAllocationsTotal(allocationsMap: InvoicesPayments) {
  if (!allocationsMap) return 0;

  const invoicesIds = Object.keys(allocationsMap);
  if (invoicesIds.length === 0) return 0;

  const paymentsTotal = invoicesIds.reduce((sum, key) => {
    const rawAmount = Number(allocationsMap[key]);
    const amount = isNaN(rawAmount) ? 0 : rawAmount;
    return sum + amount;
  }, 0);

  return paymentsTotal;
}
