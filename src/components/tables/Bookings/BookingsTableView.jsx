import { useMemo } from 'react';
import PropTypes from 'prop-types';
// import { Text } from '@chakra-ui/react';

// import useDeletebooking from "../../../hooks/useDeletebooking";
import RTTable from 'components/ui/Table/RTTable';
// import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

// import bookingDates from './bookingDates';
//
import formatRowData from './formatRowData';
import getTableColumns from './getTableColumns';
//
import { bookingProps } from 'propTypes';

function BookingsTableView(props) {
  const {
    bookings,
    onRowClick,
    enableActions,
    itemIdToHighlight,
    showCustomer,
    paymentTotal,
    paymentId,
    columnsToExclude,
    defaultAllocations,
    loading,
    error,
    pageCount,
    page,
    hitsPerPage,
    count,
    gotoPage,
    nextPage,
    previousPage,
    setHitsPerPage,
    handleSortByChange,
    ...tableProps
  } = props;
  console.log({ columnsToExclude });
  // console.log({ tableProps });
  // console.log({ bookings });

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
      const allocations = defaultAllocations || {};
      bookingsData = bookings.map(booking => {
        const { _id: bookingId } = booking;
        const paymentAllocationToBooking = allocations[bookingId];

        // console.log({ paymentAllocationToBooking, bookingId });

        const formattedData = formatRowData(
          booking,
          paymentTotal,
          paymentAllocationToBooking,
          true
        );

        return formattedData;
      });
    }

    return bookingsData;
  }, [bookings, paymentTotal, defaultAllocations]);

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
      // onSearch={setValueToSearch}
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

BookingsTableView.propTypes = {
  bookings: PropTypes.arrayOf(bookingProps),
  showCustomer: PropTypes.bool,
  paymentTotal: PropTypes.number,
  paymentId: PropTypes.string,
  formIsDisabled: PropTypes.bool,
  columnsToExclude: PropTypes.arrayOf(PropTypes.string),
  defaultAllocations: PropTypes.object,
  //
  itemIdToHighlight: PropTypes.string,
  //
  loading: PropTypes.bool,
  error: PropTypes.object,
  pageCount: PropTypes.number,
  page: PropTypes.number,
  hitsPerPage: PropTypes.number,
  count: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  setHitsPerPage: PropTypes.func,
  handleSortByChange: PropTypes.func,
};

export default BookingsTableView;

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
