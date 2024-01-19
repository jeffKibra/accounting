import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
//
import { INVOICES } from 'nav/routes';

//
export function formatBookingData(formData) {
  // console.log({ formData });
  try {
    delete formData?.vehicle?.model?.__typename;
    delete formData?.dueDate;
    delete formData?.saleDate;
    delete formData?.downPayment?.paymentMode?.__typename;
    delete formData?.paymentTerm;
  } catch (error) {
    console.error(error);
  }

  const {
    customer: { _id, displayName },
  } = formData;

  return {
    ...formData,
    customer: {
      _id,
      displayName,
    },
  };
}

function useCreateBooking() {
  const [newBooking, { called, loading, reset, error, data }] = useMutation(
    mutations.sales.bookings.CREATE_BOOKING
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  const createdInvoiceId = data?.createBooking || '';

  useEffect(() => {
    if (success) {
      toastSuccess('Booking created successfully!');
      //
      reset();
      navigate(`${INVOICES}/${createdInvoiceId}/view`);
      // navigate(`/sale/bookings`);
    }
  }, [success, toastSuccess, reset, navigate, createdInvoiceId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createBooking = useCallback(
    formData => {
      //   console.log({ formData });
      const modifiedData = formatBookingData(formData);
      newBooking({
        variables: {
          formData: modifiedData,
        },
      });
    },
    [newBooking]
  );

  return {
    loading,
    error,
    reset,
    success,
    failed,
    createBooking,
  };
}

export default useCreateBooking;
