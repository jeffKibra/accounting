import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
//
import useToasts from '../useToasts';
//
//
import { mutations } from 'gql';

//
const { DELETE_PAYMENT_RECEIVED } = mutations.sales.paymentsReceived;
//

export default function useDeletePaymentReceived(payment, successRoute) {
  const { _id: paymentId, customer, amount, paymentDate } = payment;
  // console.log({ paymentDate });

  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToasts();

  const [deletePaymentReceived, { called, loading, error, reset }] =
    useMutation(DELETE_PAYMENT_RECEIVED, {
      refetchQueries: ['ListPaymentsReceived'],
    });

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
    deletePaymentReceived({
      variables: { id: paymentId },
    });
    // dispatch({ type: DELETE_vehicle, payload: vehicleId });
  }

  const details = {
    isDone: success,
    title: 'Delete Payment',
    onConfirm: () => handleDelete(paymentId),
    loading,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Payment</Text>
        <Box p={1} pl={5}>
          <Text>
            Payment#: <b>{paymentId}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer?.displayName || ''}</b>
          </Text>
          <Text>
            Amount: <b>{Number(amount).toLocaleString()}</b>
          </Text>
          <Text>
            Payment Date :<b>{new Date(+paymentDate).toDateString()}</b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    details,
    handleDelete,
  };
}
