import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../../../useToasts';

//

function useGetVehicleModel(make, modelId) {
  const { loading, error, data, refetch } = useQuery(
    queries.vehicles.makes.models.GET_VEHICLE_MODEL,
    {
      variables: { make, id: modelId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const rawModel = data?.vehicleModel;
  // console.log({ rawModel });

  let vehicleModel = null;
  if (rawModel) {
    vehicleModel = JSON.parse(
      JSON.stringify({
        ...rawModel,
      })
    );
  }

  try {
    if (vehicleModel) {
      delete vehicleModel.__typename;
    }
  } catch (error) {
    console.error(error);
  }

  return { loading, error, vehicleModel, refetch };
}

export default useGetVehicleModel;
