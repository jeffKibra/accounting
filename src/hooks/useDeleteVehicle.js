import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_VEHICLE } from '../store/actions/vehiclesActions';

import { reset } from '../store/slices/vehiclesSlice';

export default function useDeleteVehicle(item) {
  const { vehicleId, name, variant } = item;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.vehiclesReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_VEHICLE;

  function handleDelete() {
    dispatch({ type: DELETE_VEHICLE, payload: vehicleId });
  }

  function resetVehicle() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Vehicle',
    onConfirm: () => handleDelete(vehicleId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this VEHICLE</Text>
        <Box p={1} pl={5}>
          <Text>
            VEHICLE ID: <b>{vehicleId}</b>
          </Text>
          <Text>
            VEHICLE Name: <b>{name}</b>
          </Text>
          <Text>
            VEHICLE Variant: <b>{variant}</b>
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
    resetVehicle,
  };
}
