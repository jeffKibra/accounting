import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//
import { success } from 'store/slices/monthlyBookings';

import { Bookings } from 'utils/bookings';

export default function useGetBookingsForMonth() {
  const dispatch = useDispatch();

  const monthlyBookingsState = useSelector(
    state => state?.monthlyBookingsReducer
  );
  const orgId = useSelector(state => state?.orgsReducer?.org?.orgId);
  // console.log({ monthlyBookingsState, orgId });
  const monthlyBookings = monthlyBookingsState?.monthlyBookings;

  const setMonthBookings = useCallback(
    (monthId, bookings) => {
      dispatch(success({ [monthId]: bookings }));
    },
    [dispatch]
  );

  const resetMonth = useCallback(
    monthId => {
      setMonthBookings(monthId, null);
    },
    [setMonthBookings]
  );

  const getMonthBookings = useCallback(
    async monthId => {
      let monthBookings = {};
      try {
        //reset month bookings
        setMonthBookings(monthId, null);

        monthBookings = await Bookings.getMonthBookings(orgId, monthId);

        if (!monthBookings) {
          //if no data, set monthBookings to an empty object to stop ui loading
          monthBookings = {};
        }
      } catch (error) {
        console.error(error);
        monthBookings = { error };
      }

      // console.log({ monthId, monthBookings });

      setMonthBookings(monthId, monthBookings);
    },
    [setMonthBookings, orgId]
  );

  return { monthlyBookings, setMonthBookings, resetMonth, getMonthBookings };
}
