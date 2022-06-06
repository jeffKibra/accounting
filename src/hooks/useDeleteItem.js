import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import { DELETE_ITEM } from "../store/actions/itemsActions";

import { reset } from "../store/slices/itemsSlice";

export default function useDeleteItem(item) {
  const { itemId, name, variant } = item;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector((state) => state.itemsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_ITEM;

  function handleDelete() {
    dispatch({ type: DELETE_ITEM, itemId });
  }

  function resetItem() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: "Delete Item",
    onConfirm: () => handleDelete(itemId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this ITEM</Text>
        <Box p={1} pl={5}>
          <Text>
            Item ID: <b>{itemId}</b>
          </Text>
          <Text>
            Item Name: <b>{name}</b>
          </Text>
          <Text>
            Item Variant: <b>{variant}</b>
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
    resetItem,
  };
}
