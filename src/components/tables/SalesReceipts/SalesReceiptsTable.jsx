import { useMemo } from "react";
import PropTypes from "prop-types";

// import useDeletesalesReceipt from "../../../hooks/useDeletesalesReceipt";
import SalesReceiptOptions from "../../../containers/Management/SalesReceipts/SalesReceiptOptions";

import CustomRawTable from "../CustomRawTable";
// import TableActions from "../TableActions";

function SalesReceiptsTable(props) {
  const { salesReceipts, showCustomer } = props;
  // console.log({ salesReceipts });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "DATE", accessor: "date" },
      { Header: "SALES RECEIPT#", accessor: "salesReceiptId" },
      ...(showCustomer
        ? [{ Header: "CUSTOMER", accessor: "customer.displayName" }]
        : []),
      { Header: "PAYMENT MODE", accessor: "paymentMode.name" },
      { Header: "REFERENCE", accessor: "reference" },
      { Header: "AMOUNT", accessor: "summary.totalAmount" },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return salesReceipts.map((salesReceipt) => {
      const { receiptDate } = salesReceipt;

      return {
        ...salesReceipt,
        date: receiptDate.toDateString(),
        actions: (
          <SalesReceiptOptions salesReceipt={salesReceipt} edit view deletion />
        ),
      };
    });
  }, [salesReceipts]);

  return <CustomRawTable data={data} columns={columns} />;
}

SalesReceiptsTable.propTypes = {
  salesReceipts: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      receiptDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.string.isRequired,
      salesReceiptId: PropTypes.string.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
};

export default SalesReceiptsTable;
