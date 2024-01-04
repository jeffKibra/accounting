import { useContext } from 'react';
import PropTypes from 'prop-types';
// import { Text } from '@chakra-ui/react';

import BookingsTableView from './BookingsTableView';

import ListInvoicesContext from 'contexts/ListInvoicesContext';
//
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
    defaultAllocations,
    ...tableProps
  } = props;
  // console.log({ tableProps });
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
    // setValueToSearch,
    gotoPage,
    nextPage,
    previousPage,
    // openFiltersModal,
    handleSortByChange,
    // facets,
  } = listBookingsContextValues;

  console.log({ bookings });

  return (
    <BookingsTableView
      bookings={bookings}
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
      onSort={handleSortByChange}
      // onSearch={setValueToSearch}
      onRowClick={onRowClick}
      rowIdToHighlight={itemIdToHighlight || ''}
      rowFieldToUseAsIdForHighlighting="_id"
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
  defaultAllocations: PropTypes.object,
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
