import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//

// import BookingDates from 'components/tables/Bookings/BookingDates';
//

import useToasts from '../useToasts';

import { mutations } from 'gql';

export default function useDeleteInvoice(
  invoiceId,
  queriesToRefetch,
  successRoute
) {
  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToasts();

  const [deleteInvoice, { called, loading, error, reset }] = useMutation(
    mutations.sales.invoices.DELETE_INVOICE,
    { refetchQueries: [...queriesToRefetch] }
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (success) {
      toastSuccess('Deletion Successful!');
      //
      reset();
      //
      navigate(successRoute);
    }
  }, [success, toastSuccess, reset, navigate, successRoute]);

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

  return {
    loading,
    isDeleted: success,
    handleDelete,
    resetDelete: reset,
  };
}
