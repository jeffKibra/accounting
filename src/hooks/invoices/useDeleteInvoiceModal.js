import { Box, Text } from '@chakra-ui/react';

//
import { BOOKINGS } from 'nav/routes';

import useDeleteInvoice from './useDeleteInvoice';
import { generateDeleteBookingModalDetails } from '../bookings/useDeleteBookingModal';
//
import { Bookings } from 'utils/bookings';
//

// import BookingDates from 'components/tables/Bookings/BookingDates';
//

export default function useDeleteInvoiceModal(invoice) {
  const {  _id: invoiceId, } = invoice;

  const { handleDelete, loading, isDeleted, resetDelete } = useDeleteInvoice(
    invoiceId,
    ['ListInvoices'],
    BOOKINGS
  );

  const { title, message } = generateDeleteInvoiceModalDetails(invoice);

  const details = {
    isDone: isDeleted,
    onConfirm: () => handleDelete(invoiceId),
    loading,
    title,
    message,
  };

  return {
    deleting: loading,
    isDeleted,
    details,
    handleDelete,
    resetDelete,
  };
}

function generateDeleteInvoiceModalDetails(invoice) {
  const { customer, _id: invoiceId, total, saleDate, metaData } = invoice;

  let title = 'Delete Invoice';
  let message = (
    <Box>
      <Text>Are you sure you want to delete this Invoice</Text>
      <Box p={1} pl={5}>
        {/* <Text>
            Car Registration:{' '}
            <Text as="b" textTransform="uppercase">
              {vehicle?.registration}
            </Text>
          </Text> */}
        <Text>
          Invoice Id#: <b>{invoiceId}</b>
        </Text>
        <Text>
          Customer Name: <b>{customer.displayName}</b>
        </Text>
        <Text>
          Invoice Date :<b>{new Date(+saleDate).toDateString()}</b>
        </Text>
        <Text>
          Invoice Total :<b>{Number(total).toLocaleString()}</b>
        </Text>
        {/* <Text>
            Invoice Dates :
            <b>
              <BookingDates startDate={startDate} endDate={endDate} />
            </b>
          </Text> */}
      </Box>
      <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
    </Box>
  );

  const isBooking = metaData?.saleType === 'car_booking';

  if (isBooking) {
    const booking = Bookings.convertInvoiceToBooking(invoice);
    const result = generateDeleteBookingModalDetails(booking);

    title = result.title;
    message = result.message;
  }

  return {
    title,
    message,
  };
}
