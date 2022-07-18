import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import { DELETE_TAX } from "../store/actions/taxesActions";

import { reset } from "../store/slices/taxesSlice";

export default function useDeleteTax(tax) {
  const { taxId, name, rate } = tax;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector((state) => state.taxesReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_TAX;

  function handleDelete() {
    dispatch({ type: DELETE_TAX, payload: taxId });
  }

  function resetTax() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: "Delete Tax",
    onConfirm: () => handleDelete(taxId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Tax</Text>
        <Box p={1} pl={5}>
          <Text>
            Tax Name: <b>{name}</b>
          </Text>
          <Text>
            Tax Rate: <b>{rate} %</b>
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
    resetTax,
  };
}
