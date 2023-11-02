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
  onItemSelect: PropTypes.func,
  selectedItem: PropTypes.object,
  // selectedDates: PropTypes.arrayOf(PropTypes.string),
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
  const { onItemSelect, selectedItem, selectedDates } = props;

  const itemId = selectedItem?._id || '';
  // console.log({ itemId, selectedItem });

  const { savedData } = useContext(BookingFormContext);
  const { getQueryVariables } = useContext(SearchItemsContext);

  const { preselectedDates, preselectedItemId } = useMemo(() => {
    const preselectedDates = savedData?.selectedDates || [];
    const preselectedItemId = savedData?.item?.itemId || '';

    return { preselectedItemId, preselectedDates };
  }, [savedData]);

  // console.log({ startDate, endDate });

  // console.log({ selectedDaysGroupedInMonths, availableItems });

  function handleItemClick(item) {
    // console.log({ item });
    delete item?.__typename;
    delete item?.searchScore;
    delete item?.model?.__typename;

    const queryVariables = getQueryVariables();
    // console.log({ queryVariables });

    onItemSelect(item, queryVariables);
  }

  return (
    <>
      <ItemsTable
        emptyMessage="No Vehicle is available for booking on the selected Dates!"
        onRowClick={handleItemClick}
        itemIdToHighlight={itemId || ''}
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
