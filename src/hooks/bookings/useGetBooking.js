import { useMemo } from 'react';
//
import { useGetInvoice } from 'hooks/invoices';
//
import { Bookings } from 'utils/bookings';

//

function useGetBooking(bookingId) {
  const { loading, invoice, error, refetch } = useGetInvoice(bookingId);

  const booking = useMemo(() => {
    if (!invoice) {
      return null;
    }

    return Bookings.convertInvoiceToBooking(invoice);
  }, [invoice]);

  console.log({ loading, booking, invoice, error });

  delete booking?.__typename;
  delete booking?.customer?.__typename;
  delete booking?.downPayment?.__typename;
  // delete booking?.downPayment?.paymentMode?.__typename;
  delete booking?.vehicle?.__typename;

  return { loading, error, booking, refetch };
}

export default useGetBooking;
