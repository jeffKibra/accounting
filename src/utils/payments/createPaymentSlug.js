/**
 *
 * @param {{summary:{payments:0}}} customer
 * @returns {""}
 */
export default function createPaymentSlug(customer) {
  const paymentNumber = (customer.summary?.payments || 0) + 1;
  const paymentSlug = `PR-${String(paymentNumber).padStart(6, 0)}`;

  return paymentSlug;
}
