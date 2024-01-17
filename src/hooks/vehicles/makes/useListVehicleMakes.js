import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

const { LIST_VEHICLE_MAKES } = queries.vehicles.makes;

function useListVehicleMakes() {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);

  const { error: toastError } = useToasts();

  const handleCompleted = useCallback(() => {
    console.log('completing api fetch request...');
    setInitialFetchCompleted(true);
  }, [setInitialFetchCompleted]);

  const {
    loading,
    error,
    data: result,
    refetch: refetchQuery,
    called,
  } = useQuery(LIST_VEHICLE_MAKES, {
    fetchPolicy: 'cache-and-network',
    onCompleted: handleCompleted,
  });

  console.log({ result });

  const vehicleMakes = result?.vehicleMakes;
  // console.log('gql search vehicles result', {
  //   result,
  //   result,
  //   loading,
  //   error,
  //   searchVehicles,
  // });

  const refetch = useCallback(() => {
    if (initialFetchCompleted) {
      refetchQuery();
    }
  }, [initialFetchCompleted, refetchQuery]);

  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      console.error(error);
      toastError(error?.message || 'Unknown Error');
    }
  }, [failed, error, toastError]);

  return {
    loading,
    result,
    error,
    failed,
    refetch,
    vehicleMakes,
    initialFetchCompleted,
  };
}

export default useListVehicleMakes;
