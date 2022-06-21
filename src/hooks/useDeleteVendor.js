import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import { DELETE_VENDOR } from "../store/actions/vendorsActions";

import { reset } from "../store/slices/vendorsSlice";

export default function useDeleteVendor(vendor) {
  const { vendorId, displayName } = vendor;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector((state) => state.vendorsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_VENDOR;

  function handleDelete() {
    dispatch({ type: DELETE_VENDOR, vendorId });
  }

  function resetvendor() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: "Delete Vendor",
    onConfirm: () => handleDelete(vendorId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this vendor</Text>
        <Box p={1} pl={5}>
          <Text>
            Vendor ID: <b>{vendorId}</b>
          </Text>
          <Text>
            Vendor Name: <b>{displayName}</b>
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
    resetvendor,
  };
}
