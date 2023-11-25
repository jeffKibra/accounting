import { useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//
import { GET_MONTHLY_BOOKINGS } from 'store/actions/monthlyBookings';
import { GET_ITEMS_NOT_BOOKED } from 'store/actions/itemsActions';
//
import { Bookings } from 'utils/bookings';
import { groupDatesByMonths } from 'utils/dates';
//
//
import BookingFormContext from 'contexts/BookingFormContext';
import SearchItemsContext from 'contexts/SearchItemsContext';

//
// import DateRangePicker from 'components/ui/DateRangePicker';
//
import ItemsTable from 'components/tables/Items/ItemsTable';

//---------------------------------------------------------------
ItemsLoader.propTypes = {
  // loading: PropTypes.bool.isRequired,
  // children: PropTypes.node.isRequired,
  // items: PropTypes.array,
  // loadingItems: PropTypes.bool,
  onSelect: PropTypes.func,
  selectedVehicle: PropTypes.object,
  // selectedDates: PropTypes.arrayOf(PropTypes.string),
  // startDate: PropTypes.string.isRequired,
  // endDate: PropTypes.string.isRequired,
};

ItemsLoader.defaultProps = {
  preselectedVehicleId: '',
  preselectedDates: [],
};

//------------------------------------------------------------------------------

function ItemsLoader(props) {
  // console.log({ props });
  const { onSelect, selectedVehicle } = props;

  const vehicleId = selectedVehicle?._id || '';
  // console.log({ vehicleId, selectedVehicle });

  const { savedData } = useContext(BookingFormContext);
  const { getQueryVariables } = useContext(SearchItemsContext);

  const { preselectedDates, preselectedVehicleId } = useMemo(() => {
    const preselectedDates = savedData?.selectedDates || [];
    const preselectedVehicleId = savedData?.item?.vehicleId || '';

    return { preselectedVehicleId, preselectedDates };
  }, [savedData]);

  // console.log({ startDate, endDate });

  // console.log({ selectedDaysGroupedInMonths, availableItems });

  function handleRowClick(vehicle) {
    // console.log({ item });
    delete vehicle?.__typename;
    delete vehicle?.searchScore;
    delete vehicle?.model?.__typename;

    const queryVariables = getQueryVariables();
    // console.log({ queryVariables });

    onSelect(vehicle, queryVariables);
  }

  return (
    <>
      <ItemsTable
        emptyMessage="No Vehicle is available for booking on the selected Dates!"
        onRowClick={handleRowClick}
        vehicleIdToHighlight={vehicleId || ''}
      />
    </>
  );
}

function mapStateToProps(state) {
  const { loading, monthlyBookings } = state?.monthlyBookingsReducer;
  const itemsReducer = state?.itemsReducer;
  const { loading: loadingItems, items, error: itemsError } = itemsReducer;
  // console.log({ itemsReducer, loadingItems, items });
  const orgId = state?.orgsReducer?.org?._id;

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
