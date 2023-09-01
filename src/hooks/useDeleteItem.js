import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_ITEM } from '../store/actions/itemsActions';

import { reset } from '../store/slices/itemsSlice';

export default function useDeleteItem(item) {
  const { itemId, name, sku } = item;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.itemsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_ITEM;

  function handleDelete() {
    dispatch({ type: DELETE_ITEM, payload: itemId });
  }

  function resetItem() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Vehicle',
    onConfirm: () => handleDelete(itemId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this VEHICLE</Text>
        <Box p={1} pl={5}>
          <Text>
            UNIQUE IDENTIFIER: <b>{sku}</b>
          </Text>
          <Text>
            REGISTRATION: <b>{name}</b>
          </Text>
          {/* <Text>
            VEHICLE TYPE: <b>{variant}</b>
          </Text> */}
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
    resetItem,
  };
}
