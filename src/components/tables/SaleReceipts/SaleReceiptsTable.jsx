import { useMemo } from 'react';
import PropTypes from 'prop-types';

// import useDeletesaleReceipt from "../../../hooks/useDeletesaleReceipt";
import SaleReceiptOptions from '../../../containers/Management/SaleReceipts/SaleReceiptOptions';

import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

function SaleReceiptsTable(props) {
  const { saleReceipts, showCustomer } = props;
  // console.log({ saleReceipts });

  const columns = useMemo(() => {
    return [
      { Header: '', accessor: 'actions' },
      { Header: 'DATE', accessor: 'date' },
      { Header: 'SALES RECEIPT#', accessor: 'saleReceiptId' },
      ...(showCustomer
        ? [{ Header: 'CUSTOMER', accessor: 'customer.displayName' }]
        : []),
      { Header: 'PAYMENT MODE', accessor: 'paymentMode.name' },
      { Header: 'REFERENCE', accessor: 'reference' },
      { Header: 'AMOUNT', accessor: 'summary.totalAmount' },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return saleReceipts.map(saleReceipt => {
      const { receiptDate } = saleReceipt;

      return {
        ...saleReceipt,
        date: receiptDate.toDateString(),
        actions: (
          <SaleReceiptOptions saleReceipt={saleReceipt} edit view deletion />
        ),
      };
    });
  }, [saleReceipts]);

  return <CustomRawTable data={data} columns={columns} />;
}

SaleReceiptsTable.propTypes = {
  saleReceipts: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      receiptDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.number.isRequired,
      saleReceiptId: PropTypes.string.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
};

export default SaleReceiptsTable;
