import { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
// import { Text } from '@chakra-ui/react';

// import useDeletebooking from "../../../hooks/useDeletebooking";
import RTTable from 'components/ui/Table/RTTable';
// import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

// import bookingDates from './bookingDates';
import ListInvoicesContext from 'contexts/ListInvoicesContext';
//
import getBookingTableData from './getBookingTableData';
import getTableColumns from './getTableColumns';
//
import { bookingProps } from 'propTypes';

function BookingsTable(props) {
  const {
    onRowClick,
    enableActions,
    itemIdToHighlight,
    showCustomer,
    paymentTotal,
    paymentId,
    columnsToExclude,
    ...tableProps
  } = props;
  // console.log({ bookings });

  const listBookingsContextValues = useContext(ListInvoicesContext);
  // console.log({ listBookingsContextValues });

  const {
    loading,
    list: bookings,
    error,
    pageCount,
    page,
    count,
    hitsPerPage,
    setHitsPerPage,
    setValueToSearch,
    gotoPage,
    nextPage,
    previousPage,
    // openFiltersModal,
    handleSortByChange,
    // facets,
  } = listBookingsContextValues;

  console.log({ bookings });

  const columns = useMemo(() => {
    const allColumns = getTableColumns(showCustomer, true);

    const columnsToExcludeMap = {};
    if (Array.isArray(columnsToExclude)) {
      columnsToExclude.forEach(column => {
        columnsToExcludeMap[column] = column;
      });
    }

    const columnsToDisplay = [];
    allColumns.forEach(column => {
      const columnId = column.accessor;
      const excludeColumn = Boolean(columnsToExcludeMap[columnId]);

      if (!excludeColumn) {
        columnsToDisplay.push(column);
      }
    });

    return columnsToDisplay;
  }, [showCustomer, columnsToExclude]);

  const data = useMemo(() => {
    let bookingsData = [];

    if (Array.isArray(bookings)) {
      bookingsData = bookings.map(booking => {
        const formattedData = getBookingTableData(
          booking,
          paymentTotal,
          paymentId,
          true
        );

        return formattedData;
      });
    }

    return bookingsData;
  }, [bookings, paymentId, paymentTotal]);

  const rowsAreSelectable = typeof onRowClick === 'function';

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
      onSearch={setValueToSearch}
      onRowClick={onRowClick}
      rowIdToHighlight={itemIdToHighlight || ''}
      rowFieldToUseAsIdForHighlighting="_id"
      highlightedRowBGColor="cyan.50"
      {...(rowsAreSelectable
        ? {
            bodyRowProps: {
              cursor: 'pointer',
              transition: 'all 100ms ease-in-out',
              _hover: {
                backgroundColor: 'cyan.100',
              },
              _active: {
                backgroundColor: 'cyan.200',
              },
            },
          }
        : {})}
      {...tableProps}
    />
  );
}

BookingsTable.propTypes = {
  bookings: PropTypes.arrayOf(bookingProps),
  showCustomer: PropTypes.bool,
  paymentTotal: PropTypes.number,
  paymentId: PropTypes.string,
  formIsDisabled: PropTypes.bool,
  columnsToExclude: PropTypes.arrayOf(PropTypes.string),
};

export default BookingsTable;

// function bookingTableActions(props) {
//   const { booking } = props;

//   const { details } = useDeletebooking(booking);

//   const { bookingId } = booking;

//   return (
//     <TableActions
//       viewRoute={`${bookingId}/view`}
//       deleteDialog={{ ...details }}
//     />
//   );
// }
