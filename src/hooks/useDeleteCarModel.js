import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_CAR_MODEL } from '../store/actions/carModelsActions';

import { reset } from '../store/slices/carModelsSlice';

export default function useDeleteCarModel(carModel) {
  const { id: modelId, make, model, year } = carModel;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.carModelsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_CAR_MODEL;

  function handleDelete() {
    dispatch({ type: DELETE_CAR_MODEL, payload: modelId });
  }

  function resetCarModel() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Vehicle',
    onConfirm: () => handleDelete(modelId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this CAR MODEL</Text>
        <Box p={1} pl={5}>
          <Text>
            MAKE: <b>{make}</b>
          </Text>
          <Text>
            MODEL: <b>{model}</b>
          </Text>
          <Text>
            YEAR: <b>{year}</b>
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
    resetCarModel,
  };
}
