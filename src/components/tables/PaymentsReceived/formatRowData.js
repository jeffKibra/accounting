import PaymentReceivedOptions from 'containers/Management/PaymentsReceived/PaymentReceivedOptions';

//
//

export default function formatRowData(payment) {
  const { paymentDate, payments, amount, excess } = payment;
  const invoicesIds = payments ? Object.keys(payments) : [];
  // const paymentsTotal = invoicesIds.reduce((sum, key) => {
  //   return sum + +payments[key];
  // }, 0);
  // const excess = amount - paymentsTotal;

  return {
    ...payment,
    invoices: [...invoicesIds].join(','),
    amount: Number(amount).toLocaleString(),
    excess: Number(excess).toLocaleString(),
    paymentDate: new Date(+paymentDate).toDateString(),
    actions: <PaymentReceivedOptions payment={payment} edit view deletion />,
  };
}
