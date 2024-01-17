import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

//

function useGetVehicleMake(makeId) {
  const { loading, error, data, refetch } = useQuery(
    queries.vehicles.makes.GET_VEHICLE_MAKE,
    {
      variables: { id: makeId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const rawVehicleMake = data?.vehicleMake;
  console.log({ rawVehicleMake });

  let vehicleMake = null;
  if (rawVehicleMake) {
    vehicleMake = JSON.parse(
      JSON.stringify({
        ...rawVehicleMake,
      })
    );
  }

  try {
    if (vehicleMake) {
      delete vehicleMake.__typename;
    }
  } catch (error) {
    console.error(error);
  }

  return { loading, error, vehicleMake, refetch };
}

export default useGetVehicleMake;
