import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from './useToasts';
import { useEffect } from 'react';

//

function useGetBooking(bookingId) {
  const { loading, error, data, refetch } = useQuery(
    queries.bookings.GET_BOOKING,
    {
      variables: { id: bookingId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const rawBooking = data?.booking;
  console.log({ rawBooking });

  let booking = null;
  if (rawBooking) {
    const { startDate, endDate } = rawBooking;

    booking = {
      ...rawBooking,
      startDate: new Date(+startDate),
      endDate: new Date(+endDate),
    };
  }

  delete booking?.__typename;
  delete booking?.customer?.__typename;
  delete booking?.downPayment?.__typename;
  delete booking?.downPayment?.paymentMode?.__typename;
  delete booking?.vehicle?.__typename;

  return { loading, error, booking, refetch };
}

export default useGetBooking;
