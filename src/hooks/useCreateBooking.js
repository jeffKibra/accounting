import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from './useToasts';

//
export function formatBookingData(formData) {
  delete formData?.dueDate;
  delete formData?.saleDate;
  const {
    customer: { id, displayName },
  } = formData;

  return {
    ...formData,
    customer: {
      _id: id,
      displayName,
    },
  };
}

function useCreateBooking() {
  const [newBooking, { called, loading, reset, error }] = useMutation(
    mutations.bookings.CREATE_BOOKING
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Booking created successfully!');
      //
      reset();
      navigate(`/sale/bookings`);
    }
  }, [success, toastSuccess, reset, navigate]);

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
