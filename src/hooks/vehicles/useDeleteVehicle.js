import {
  useEffect,
  // useContext
} from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import {
  mutations,
  // queries
} from 'gql';
import useToasts from '../useToasts';
//
// import SearchItemsContext from 'contexts/SearchItemsContext/Context';
//
import { ITEMS } from 'nav/routes';

// import { DELETE_ITEM } from '../store/actions/itemsActions';
// import { reset } from '../store/slices/itemsSlice';

const { DELETE_VEHICLE } = mutations.vehicles;
// const { SEARCH_VEHICLES } = queries.vehicles;

export default function useDeleteVehicle(vehicle) {
  // console.log({ item });
  const { _id: vehicleId, registration, model } = vehicle;
  const { name: modelName, make, year } = model;
  // const {
  //   loading,
  //   action,
  //   isModified: isDeleted,
  // } = useSelector(state => state.itemsReducer);
  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const [deleteVehicle, { called, loading, reset, error }] = useMutation(
    DELETE_VEHICLE,
    {
      refetchQueries: [
        'SearchVehicles',
        // { query: 'SearchVehicles', variables: {} },
      ],

      // update(cache, result, options) {
      //   //activate if refetch queries completely fails to work
      //   // console.log({ cache, result, options });
      //   const deletedVehicleId = options.variables.id;
      //   window.apolloCache = cache;
      //   window.SEARCH_VEHICLES = SEARCH_VEHICLES;
      //   // console.log({ deletedVehicleId });
      //   const searchVehiclesVariables = JSON.parse(
      //     localStorage.getItem('searchVehiclesVariables')
      //   );
      //   // console.log({ searchVehiclesVariables });
      //   const queryOptions = {
      //     query: SEARCH_VEHICLES,
      //     variables: searchVehiclesVariables,
      //   };
      //   const cacheResult = cache.readQuery({
      //     ...queryOptions,
      //   });
      //   // console.log({ cacheResult });
      //   if (cacheResult) {
      //     const cachedVehicles = cacheResult?.searchVehicles?.vehicles;
      //     const cachedMeta = cacheResult?.searchVehicles?.meta;
      //     let newCachedVehicles = [];
      //     if (Array.isArray(cachedVehicles)) {
      //       newCachedVehicles = cachedVehicles.filter(
      //         vehicle => vehicle.id !== deletedVehicleId
      //       );
      //     }
      //     cache.writeQuery({
      //       ...queryOptions,
      //       data: {
      //         searchVehicles: {
      //           meta: cachedMeta,
      //           vehicles: newCachedVehicles,
      //         },
      //       },
      //     });
      //   }
      // },
    }
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (success) {
      toastSuccess('Item successfully deleted!');
      //
      reset();
      //
      navigate(ITEMS);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error.message);
    }
  }, [failed, error, toastError]);

  function handleDelete() {
    deleteVehicle({
      variables: { id: vehicleId },
    });
    // dispatch({ type: DELETE_ITEM, payload: vehicleId });
  }

  const details = {
    isDone: success,
    title: 'Delete Vehicle',
    onConfirm: handleDelete,
    loading,
    message: (
      <Box>
        <Text>Are you sure you want to delete this VEHICLE</Text>
        <Box p={1} pl={5}>
          <Text>
            REGISTRATION: <b>{registration}</b>
          </Text>
          <Text>
            Model: <b>{`${make} ${modelName} ${year ? `(${year})` : ''}`}</b>
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
    deleting: loading,
    isDeleted: success,
    details,
    handleDelete,
    resetItem: reset,
  };
}
