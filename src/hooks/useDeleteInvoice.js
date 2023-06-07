import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_INVOICE } from '../store/actions/invoicesActions';

import { reset } from '../store/slices/invoicesSlice';

export default function useDeleteInvoice(invoice) {
  const { customer, invoiceId, saleDate, item } = invoice;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.invoicesReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_INVOICE;

  function handleDelete() {
    dispatch({ type: DELETE_INVOICE, payload: invoiceId });
  }

  function resetInvoice() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Booking',
    onConfirm: () => handleDelete(invoiceId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Booking</Text>
        <Box p={1} pl={5}>
          <Text>
            Registration: <b>{item?.name}</b>
          </Text>
          <Text>
            BookingId#: <b>{invoiceId}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer.displayName}</b>
          </Text>
          <Text>
            Invoice Date :<b>{saleDate.toDateString()}</b>
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
    resetInvoice,
  };
}
