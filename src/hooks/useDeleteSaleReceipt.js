import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_SALE_RECEIPT } from '../store/actions/saleReceiptsActions';

import { reset } from '../store/slices/saleReceiptsSlice';

export default function useDeleteSaleReceipt(saleReceipt) {
  const { customer, saleReceiptId, receiptDate } = saleReceipt;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.saleReceiptsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_SALE_RECEIPT;

  function handleDelete() {
    dispatch({ type: DELETE_SALE_RECEIPT, payload: saleReceiptId });
  }

  function resetSaleReceipt() {
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
            saleReceipt#: <b>{saleReceiptId}</b>
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
    resetSaleReceipt,
  };
}
