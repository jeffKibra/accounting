import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from './useToasts';
import { useEffect } from 'react';

function useGetVehicle(vehicleId) {
  const { loading, error, data, refetch } = useQuery(
    queries.vehicles.GET_VEHICLE,
    {
      variables: { id: vehicleId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const vehicle = data?.vehicle
    ? JSON.parse(JSON.stringify(data.vehicle))
    : null;

  try {
    if (vehicle) {
      delete vehicle?.__typename;
      delete vehicle?.model?.__typename;
    }
  } catch (error) {
    console.warn(error);
  }

  return { loading, error, vehicle, refetch };
}

export default useGetVehicle;
