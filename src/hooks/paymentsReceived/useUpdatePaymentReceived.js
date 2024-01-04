import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
import useGetPaymentReceived from './useGetPaymentReceived';
import { formatPaymentReceivedData } from './useCreatePaymentReceived';

//
const { UPDATE_PAYMENT_RECEIVED } = mutations.sales.paymentsReceived;
//

function useUpdatePaymentReceived(paymentId) {
  const [modifyPaymentReceived, { called, loading: updating, reset, error }] =
    useMutation(UPDATE_PAYMENT_RECEIVED);

  console.log('use update payment received');

  const { loading, paymentReceived } = useGetPaymentReceived(
    paymentId,
    'update'
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !updating && !error;
  const failed = called && !updating && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('payment received updated successfully!');
      //
      reset();
      //booking invoice view page
      navigate(`/sale/payments-received/${paymentId}/view`);
    }
  }, [success, toastSuccess, reset, navigate, paymentId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  // const currentSelectedVehicleId = booking?.vehicle?._id;

  const updatePaymentReceived = useCallback(
    formData => {
      //check if selectedVehicle has changed.
      // if (currentSelectedVehicleId === formData?.vehicle?._id) {
      //   delete formData?.vehicle;
      // }

      //   console.log({ formData });
      const formattedData = formatPaymentReceivedData(formData);
      // console.log({ formattedData, formData });

      return modifyPaymentReceived({
        variables: {
          id: paymentId,
          formData: formattedData,
        },
      });
    },
    [
      paymentId,
      modifyPaymentReceived,
      // currentSelectedVehicleId
    ]
  );

  return {
    updating,
    error,
    reset,
    success,
    failed,
    updatePaymentReceived,
    //fetching params
    loading,
    paymentReceived,
  };
}

export default useUpdatePaymentReceived;
