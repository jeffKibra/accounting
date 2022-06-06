import { useMemo } from "react";
import PropTypes from "prop-types";

import PaymentOptions from "../../../containers/Management/Payments/PaymentOptions";
import CustomTable from "../CustomTable";

function PaymentsTable(props) {
  const { payments } = props;

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "paymentDate" },
      { Header: "Payment#", accessor: "paymentSlug" },
      { Header: "Reference", accessor: "reference" },
      { Header: "Customer", accessor: "customer.displayName" },
      //   { Header: "Invoices", accessor: "invoices" },
      { Header: "Mode", accessor: "paymentMode.name" },
      { Header: "Amount", accessor: "amount", isNumeric: true },
      { Header: "Excess", accessor: "excess", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return payments.map((payment) => {
      const { paymentDate, payments, amount } = payment;
      const invoicesIds = payments ? Object.keys(payments) : [];
      const paymentsTotal = invoicesIds.reduce((sum, key) => {
        return sum + +payments[key];
      }, 0);
      const excess = amount - paymentsTotal;

      return {
        ...payment,
        invoices: [...invoicesIds].join(","),
        excess,
        paymentDate: new Date(paymentDate).toDateString(),
        actions: <PaymentOptions payment={payment} edit view deletion />,
      };
    });
  }, [payments]);

  return <CustomTable data={data} columns={columns} />;
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
      paymentSlug: PropTypes.string.isRequired,
      payments: PropTypes.object,
      paymentDate: PropTypes.instanceOf(Date).isRequired,
      paymentMode: PropTypes.object.isRequired,
      account: PropTypes.object.isRequired,
      paymentId: PropTypes.string.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PaymentsTable;
