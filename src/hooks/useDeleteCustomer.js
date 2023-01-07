import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_CUSTOMER } from '../store/actions/customersActions';

import { reset } from '../store/slices/customersSlice';

export default function useDeleteCustomer(customer) {
  const { id: customerId, displayName, type } = customer;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.customersReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_CUSTOMER;

  function handleDelete() {
    dispatch({ type: DELETE_CUSTOMER, payload: customerId });
  }

  function resetCustomer() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Customer',
    onConfirm: () => handleDelete(customerId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Customer</Text>
        <Box p={1} pl={5}>
          <Text>
            Customer ID: <b>{customerId}</b>
          </Text>
          <Text>
            Customer Name: <b>{displayName}</b>
          </Text>
          <Text>
            Customer Type: <b>{type}</b>
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
    resetCustomer,
  };
}
