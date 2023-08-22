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
  console.log({ monthlyBookingsState, orgId });
  const monthlyBookings = monthlyBookingsState?.monthlyBookings;

  function setMonthBookings(monthId, bookings) {
    dispatch(success({ [monthId]: bookings }));
  }

  function resetMonth(monthId) {
    setMonthBookings(monthId, null);
  }

  async function getMonthBookings(monthId) {
    let monthBookings = {};
    try {
      resetMonth(monthId);

      monthBookings = await Bookings.getMonthBookings(orgId, monthId);
    } catch (error) {
      console.error(error);
      monthBookings = { error };
    }

    setMonthBookings(monthId, monthBookings);
  }

  return { monthlyBookings, setMonthBookings, resetMonth, getMonthBookings };
}
