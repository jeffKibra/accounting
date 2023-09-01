import { useMemo } from 'react';
import PropTypes from 'prop-types';

import PaymentOptions from '../../../containers/Management/Payments/PaymentOptions';
import CustomRawTable from '../CustomRawTable';

function PaymentsTable(props) {
  const { payments, showCustomer } = props;

  const columns = useMemo(() => {
    return [
      { Header: 'Date', accessor: 'paymentDate' },
      { Header: 'Payment#', accessor: 'paymentId' },
      { Header: 'Reference', accessor: 'reference' },
      ...(showCustomer
        ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
        : []),
      //   { Header: "Invoices", accessor: "invoices" },
      { Header: 'Mode', accessor: 'paymentMode.name' },
      { Header: 'Amount', accessor: 'amount', isNumeric: true },
      { Header: 'Excess', accessor: 'excess', isNumeric: true },
      { Header: '', accessor: 'actions' },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return payments.map(payment => {
      const { paymentDate, payments, amount } = payment;
      const invoicesIds = payments ? Object.keys(payments) : [];
      const paymentsTotal = invoicesIds.reduce((sum, key) => {
        return sum + +payments[key];
      }, 0);
      const excess = amount - paymentsTotal;

      return {
        ...payment,
        invoices: [...invoicesIds].join(','),
        excess,
        paymentDate: new Date(paymentDate).toDateString(),
        actions: <PaymentOptions payment={payment} edit view deletion />,
      };
    });
  }, [payments]);

  return <CustomRawTable data={data} columns={columns} />;
}

PaymentsTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      amount: PropTypes.number.isRequired,
      reference: PropTypes.string,
      paymentId: PropTypes.string.isRequired,
      payments: PropTypes.object,
      paymentDate: PropTypes.instanceOf(Date).isRequired,
      paymentMode: PropTypes.object.isRequired,
      account: PropTypes.object.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
};

export default PaymentsTable;
