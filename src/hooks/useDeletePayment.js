import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import { DELETE_PAYMENT } from "../store/actions/paymentsActions";

import { reset } from "../store/slices/paymentsSlice";

export default function useDeletePayment(payment) {
  const { paymentSlug, customer, paymentId, paymentDate } = payment;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector((state) => state.paymentsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_PAYMENT;

  function handleDelete() {
    dispatch({ type: DELETE_PAYMENT, paymentId });
  }

  function resetPayment() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: "Delete Payment",
    onConfirm: () => handleDelete(paymentId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Payment</Text>
        <Box p={1} pl={5}>
          <Text>
            Payment#: <b>{paymentSlug}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer.displayName}</b>
          </Text>
          <Text>
            Payment Date :<b>{paymentDate.toDateString()}</b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    deleting,
    isDeleted,
    details,
    handleDelete,
    resetPayment,
  };
}
