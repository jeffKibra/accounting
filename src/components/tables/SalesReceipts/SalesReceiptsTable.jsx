import { useMemo } from "react";
import PropTypes from "prop-types";

// import useDeletesalesReceipt from "../../../hooks/useDeletesalesReceipt";
import SalesReceiptOptions from "../../../containers/Management/SalesReceipts/SalesReceiptOptions";

import CustomTable from "../CustomTable";
// import TableActions from "../TableActions";

function SalesReceiptsTable(props) {
  const { salesReceipts } = props;
  // console.log({ salesReceipts });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "DATE", accessor: "date" },
      { Header: "SALES RECEIPT#", accessor: "salesReceiptSlug" },
      { Header: "CUSTOMER", accessor: "customer.displayName" },
      { Header: "PAYMENT MODE", accessor: "status" },
      { Header: "REFERENCE", accessor: "reference" },
      { Header: "AMOUNT", accessor: "summary.totalAmount" },
    ];
  }, []);

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

  return <CustomTable data={data} columns={columns} />;
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
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default SalesReceiptsTable;
