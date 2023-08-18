import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//
import { Bookings } from 'utils/bookings';
//

function useCheckItemAvailability() {
  const orgId = useSelector(state => state?.orgsReducer?.org?.orgId);
  console.log({ orgId });

  const [loading, setLoading] = useState(false);
  const [itemIsAvailable, setItemIsAvailable] = useState(false);

  const checkItemAvailability = useCallback(
    async (itemId, dateRange) => {
      setLoading(true);
      //reset
      setItemIsAvailable(false);

      try {
        if (orgId) {
          const status = await Bookings.checkItemAvailabilityForSelectedDates(
            orgId,
            itemId,
            dateRange,
            ''
          );

          console.log({ status });
          setItemIsAvailable(status);
        } else {
          console.error('Invalid orgId: ', orgId);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    },
    [orgId]
  );

  console.log({ itemIsAvailable });

  useEffect(() => {
    console.log('check item availability function recreated!');
  }, [checkItemAvailability]);

  return {
    checkItemAvailability,
    loading,
    itemIsAvailable,
  };
}

export default useCheckItemAvailability;
