import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_SALES_RECEIPT } from '../store/actions/salesReceiptsActions';

import { reset } from '../store/slices/salesReceiptsSlice';

export default function useDeleteSalesReceipt(salesReceipt) {
  const { customer, saleReceiptId, receiptDate } = salesReceipt;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.salesReceiptsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_SALES_RECEIPT;

  function handleDelete() {
    dispatch({ type: DELETE_SALES_RECEIPT, payload: saleReceiptId });
  }

  function resetSalesReceipt() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Sales Receipt',
    onConfirm: () => handleDelete(saleReceiptId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Sales Receipt</Text>
        <Box p={1} pl={5}>
          <Text>
            salesReceipt#: <b>{saleReceiptId}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer.displayName}</b>
          </Text>
          <Text>
            Date :<b>{receiptDate.toDateString()}</b>
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
    resetSalesReceipt,
  };
}
