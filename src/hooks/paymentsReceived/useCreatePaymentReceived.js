import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';

//
const { CREATE_PAYMENT_RECEIVED } = mutations.sales.paymentsReceived;
//

export function formatPaymentReceivedData(formData) {
  try {
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

function useCreatePaymentReceived() {
  const [newPaymentReceived, { called, loading, reset, error }] = useMutation(
    CREATE_PAYMENT_RECEIVED
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Payment Received created successfully!');
      //
      reset();
      navigate(`/sale/payments-received`);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createPaymentReceived = useCallback(
    formData => {
      //   console.log({ formData });
      const modifiedData = formatPaymentReceivedData(formData);
      newPaymentReceived({
        variables: {
          formData: modifiedData,
        },
      });
    },
    [newPaymentReceived]
  );

  return {
    loading,
    error,
    reset,
    success,
    failed,
    createPaymentReceived,
  };
}

export default useCreatePaymentReceived;
