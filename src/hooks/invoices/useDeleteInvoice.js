import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//
import { BOOKINGS } from 'nav/routes';
//

import BookingDates from 'components/tables/Bookings/BookingDates';
//
import useToasts from '../useToasts';

import { mutations } from 'gql';

export default function useDeleteInvoice(invoice) {
  const { customer, _id: invoiceId, vehicle, startDate, endDate } = invoice;

  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToasts();

  const [deleteInvoice, { called, loading, error, reset }] = useMutation(
    mutations.invoices.DELETE_BOOKING,
    { refetchQueries: ['ListInvoices'] }
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (success) {
      toastSuccess('Invoice successfully deleted!');
      //
      reset();
      //
      navigate(BOOKINGS);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error.message);
    }
  }, [failed, error, toastError]);

  function handleDelete() {
    deleteInvoice({
      variables: { id: invoiceId },
    });
    // dispatch({ type: DELETE_vehicle, payload: vehicleId });
  }

  const details = {
    isDone: success,
    title: 'Delete Invoice',
    onConfirm: () => handleDelete(invoiceId),
    // loading: deleting,
    loading,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Invoice</Text>
        <Box p={1} pl={5}>
          <Text>
            Car Registration:{' '}
            <Text as="b" textTransform="uppercase">
              {vehicle?.registration}
            </Text>
          </Text>
          <Text>
            Invoice Id#: <b>{invoiceId}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer.displayName}</b>
          </Text>
          {/* <Text>
            Invoice Dates :<b>{saleDate.toDateString()}</b>
          </Text> */}
          <Text>
            Invoice Dates :
            <b>
              <BookingDates startDate={startDate} endDate={endDate} />
            </b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    deleting: loading,
    isDeleted: success,
    details,
    handleDelete,
    resetDelete: reset,
  };
}
