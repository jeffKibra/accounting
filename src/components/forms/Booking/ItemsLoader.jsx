import { useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useFormContext } from 'react-hook-form';

//
import { GET_MONTHLY_BOOKINGS } from 'store/actions/monthlyBookings';
import { GET_ITEMS_NOT_BOOKED } from 'store/actions/itemsActions';
//
import { Bookings } from 'utils/bookings';
import { groupDatesByMonths } from 'utils/dates';
//
import BookingFormContext from 'contexts/BookingFormContext';

//
// import DateRangePicker from 'components/ui/DateRangePicker';
//
import SelectBookingItemTable from 'components/tables/Items/SelectBookingItemTable';

//---------------------------------------------------------------
ItemsLoader.propTypes = {
  // loading: PropTypes.bool.isRequired,
  // children: PropTypes.node.isRequired,
  items: PropTypes.array,
  loadingItems: PropTypes.bool,
  onItemSelect: PropTypes.func,
  selectedDates: PropTypes.arrayOf(PropTypes.string),
  // startDate: PropTypes.string.isRequired,
  // endDate: PropTypes.string.isRequired,
};

ItemsLoader.defaultProps = {
  preselectedItemId: '',
  preselectedDates: [],
};

//------------------------------------------------------------------------------

function ItemsLoader(props) {
  // console.log({ props });
  const {
    items,
    loadingItems,
    itemsError,
    fetchItemsNotBooked,
    // defaultItemId,
    orgId,
    onItemSelect,
    selectedDates,
  } = props;

  const [idsForItemsAlreadyBooked, setIdsForItemsAlreadyBooked] = useState([]);

  const { watch } = useFormContext();
  const itemId = watch('item')?.itemId || '';

  const { savedData } = useContext(BookingFormContext);

  const { preselectedDates, preselectedItemId } = useMemo(() => {
    const preselectedDates = savedData?.selectedDates || [];
    const preselectedItemId = savedData?.item?.itemId || '';

    return { preselectedItemId, preselectedDates };
  }, [savedData]);

  useEffect(() => {
    if (selectedDates?.length > 0) {
      const datesGroupedInMonths = groupDatesByMonths(selectedDates);
      // console.log({ datesGroupedInMonths, selectedDates });

      Bookings.getIdsForItemsAlreadyBooked(
        orgId,
        datesGroupedInMonths
        // preselectedItemId,
        // preselectedDates
      ).then(itemsIds => {
        setIdsForItemsAlreadyBooked(itemsIds);
      });
    }
  }, [selectedDates, orgId, preselectedItemId, preselectedDates]);
  // console.log({ idsForItemsAlreadyBooked });

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
        emptyMessage="No Vehicle is available for booking on the selected Dates!"
        loading={loadingItems}
        items={items || []}
        error={itemsError}
        onRowClick={handleItemClick}
        selectedItemId={itemId}
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
