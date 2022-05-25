/**
 *
 * @param {{}} payments
 * @returns {0} paymentsTotal
 */
export function getPaymentsTotal(payments) {
  if (!payments) return 0;

  const invoicesIds = Object.keys(payments);
  if (invoicesIds.length === 0) return 0;

  const paymentsTotal = invoicesIds.reduce((sum, key) => {
    return sum + +payments[key];
  }, 0);

  return paymentsTotal;
}
