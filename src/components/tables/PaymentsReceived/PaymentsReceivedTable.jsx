import { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
//

import ListPaymentsReceivedContext from 'contexts/ListPaymentsReceivedContext';
//

import RTTable from 'components/ui/Table/RTTable';

//
import getTableColumns from './getTableColumns';
import formatRowData from './formatRowData';

function PaymentsReceivedTable(props) {
  const { payments, showCustomer, ...tableProps } = props;

  const listPaymentsReceivedContextValues = useContext(
    ListPaymentsReceivedContext
  );

  const {
    loading,
    list: paymentsReceivedList,
    error,
    pageCount,
    page,
    count,
    hitsPerPage,
    setHitsPerPage,
    // setValueToSearch,
    gotoPage,
    nextPage,
    previousPage,
    // openFiltersModal,
    handleSortByChange,
    // facets,
  } = listPaymentsReceivedContextValues;

  console.log({ paymentsReceivedList });

  const columns = useMemo(() => {
    return getTableColumns(showCustomer);
  }, [showCustomer]);

  const data = useMemo(() => {
    let payments = [];

    if (Array.isArray(paymentsReceivedList)) {
      payments = paymentsReceivedList.map(payment => {
        const formattedData = formatRowData(payment);

        return formattedData;
      });
    }

    return payments;
  }, [paymentsReceivedList]);

  return (
    <RTTable
      columns={columns}
      data={data}
      //status
      loading={loading}
      error={error}
      //pagination
      pageCount={pageCount}
      pageIndex={page}
      pageSize={hitsPerPage}
      allItemsCount={count}
      gotoPage={gotoPage}
      nextPage={nextPage}
      previousPage={previousPage}
      setPageSize={setHitsPerPage}
      //
      // onFiltersModalOpen={openFiltersModal}
      //
      onSort={handleSortByChange}
      {...tableProps}

      // onSearch={setValueToSearch}
      // onRowClick={onRowClick}
      // rowIdToHighlight={itemIdToHighlight || ''}
      // rowFieldToUseAsIdForHighlighting="_id"
      // highlightedRowBGColor="cyan.50"
      // {...(rowsAreSelectable
      //   ? {
      //       bodyRowProps: {
      //         cursor: 'pointer',
      //         transition: 'all 100ms ease-in-out',
      //         _hover: {
      //           backgroundColor: 'cyan.100',
      //         },
      //         _active: {
      //           backgroundColor: 'cyan.200',
      //         },
      //       },
      //     }
      //   : {})}
    />
  );
}

PaymentsReceivedTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
      }),
      amount: PropTypes.number.isRequired,
      reference: PropTypes.string,
      paidInvoices: PropTypes.arrayOf(
        PropTypes.shape({
          invoiceId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
        })
      ),
      excess: PropTypes.number.isRequired,
      paymentDate: PropTypes.instanceOf(Date).isRequired,
      paymentMode: PropTypes.object.isRequired,
      account: PropTypes.object.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
};

export default PaymentsReceivedTable;
