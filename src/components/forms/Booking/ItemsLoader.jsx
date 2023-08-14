import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//
import { GET_MONTHLY_BOOKINGS } from 'store/actions/monthlyBookings';
import { GET_ITEMS_NOT_BOOKED } from 'store/actions/itemsActions';
//
import { Bookings } from 'utils/bookings';

//
// import DateRangePicker from 'components/ui/DateRangePicker';
//
import SelectBookingItemTable from 'components/tables/Items/SelectBookingItemTable';

//---------------------------------------------------------------
ItemsLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  childrem: PropTypes.node.isRequired,
  items: PropTypes.array,
  loadingItems: PropTypes.bool,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func,
};

//------------------------------------------------------------------------------

function ItemsLoader(props) {
  console.log({ props });
  const {
    items,
    loadingItems,
    itemsError,
    // loading,
    fetchItemsNotBooked,
    startDate,
    endDate,
    // defaultItemId,
    orgId,
    onItemSelect,
  } = props;
  // console.log({ props });
  // console.log({ loadingMonthlyBookings, monthlyBookings });
  // const [dateRange, setDateRange] = useState(null);

  const [idsForItemsAlreadyBooked, setIdsForItemsAlreadyBooked] = useState([]);

  const defaultBookingDays = useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    const bookingDays = Bookings.getBookingDays(startDate, endDate);
    console.log({ bookingDays });
    const { ungroupedDates, datesGroupedInMonths } = bookingDays;

    Bookings.getIdsForItemsAlreadyBooked(orgId, datesGroupedInMonths).then(
      itemsIds => {
        setIdsForItemsAlreadyBooked(itemsIds);
      }
    );

    return ungroupedDates;
  }, [startDate, endDate, orgId]);
  console.log({ defaultBookingDays, idsForItemsAlreadyBooked });

  useEffect(() => {
    fetchItemsNotBooked(idsForItemsAlreadyBooked);
  }, [idsForItemsAlreadyBooked, fetchItemsNotBooked]);

  // console.log({ startDate, endDate });

  // console.log({ selectedDaysGroupedInMonths, availableItems });

  function handleItemClick(item) {
    // console.log({ item });
    onItemSelect(item);
  }

  return (
    <>
      <SelectBookingItemTable
        loading={loadingItems}
        items={items || []}
        error={itemsError}
        onRowClick={handleItemClick}
      />
    </>
  );
}

function mapStateToProps(state) {
  const { loading, monthlyBookings } = state?.monthlyBookingsReducer;
  const itemsReducer = state?.itemsReducer;
  const { loading: loadingItems, items, error: itemsError } = itemsReducer;
  // console.log({ itemsReducer, loadingItems, items });
  const orgId = state?.orgsReducer?.org?.orgId;

  // console.log({ orgId });

  return {
    loadingMonthlyBookings: loading,
    monthlyBookings,
    orgId,
    loadingItems,
    items,
    itemsError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMonthlyBookings: months =>
      dispatch({ type: GET_MONTHLY_BOOKINGS, payload: months }),
    fetchItemsNotBooked: idsForItemsToExclude =>
      dispatch({ type: GET_ITEMS_NOT_BOOKED, payload: idsForItemsToExclude }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsLoader);
