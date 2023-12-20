import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
import useGetBooking from './useGetBooking';
import { formatBookingData } from './useCreateBooking';

function useUpdateBooking(bookingId) {
  const [modifyBooking, { called, loading: updating, reset, error }] =
    useMutation(mutations.sales.bookings.UPDATE_BOOKING);

  const { loading, booking } = useGetBooking(bookingId);

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !updating && !error;
  const failed = called && !updating && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('booking updated successfully!');
      //
      reset();
      //booking invoice view page
      navigate(`/sale/bookings/${bookingId}/invoice`);
    }
  }, [success, toastSuccess, reset, navigate, bookingId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  // const currentSelectedVehicleId = booking?.vehicle?._id;

  const updateBooking = useCallback(
    formData => {
      //check if selectedVehicle has changed.
      // if (currentSelectedVehicleId === formData?.vehicle?._id) {
      //   delete formData?.vehicle;
      // }

      //   console.log({ formData });
      const formattedData = formatBookingData(formData);
      // console.log({ formattedData, formData });

      return modifyBooking({
        variables: {
          id: bookingId,
          formData: formattedData,
        },
      });
    },
    [
      bookingId,
      modifyBooking,
      // currentSelectedVehicleId
    ]
  );

  return {
    updating,
    error,
    reset,
    success,
    failed,
    updateBooking,
    //fetching params
    loading,
    booking,
  };
}

export default useUpdateBooking;
