import { useEffect, useCallback, useState } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../../useToasts';

//

function useGetVehicleMake(defaultMake = '') {
  const [refetching, setRefetching] = useState(false);
  const [data, setData] = useState(null);
  const [refetchError, setRefetchError] = useState(null);

  const shouldSkip = !defaultMake;

  const {
    loading,
    error,
    refetch: refetchQuery,
  } = useQuery(queries.vehicles.makes.GET_VEHICLE_MAKE, {
    variables: { name: defaultMake },
    skip: shouldSkip,
  });

  const refetch = useCallback(
    async name => {
      // console.log('fetching vehicle make...');
      setRefetching(true);

      try {
        const result = await refetchQuery({ name });
        setData(result?.data);
      } catch (error) {
        setRefetchError(error);
        console.error('Error fetching vehicle make: ', error);
      } finally {
        setRefetching(false);
      }
    },
    [refetchQuery, setRefetching, setData]
  );

  const { error: toastError } = useToasts();

  const failed =
    !loading && !refetching && (Boolean(error) || Boolean(refetchError));

  useEffect(() => {
    if (failed) {
      const err = error || refetchError;

      toastError(err?.message || 'Unknown error!');
    }
  }, [failed, error, refetchError, toastError]);

  // console.log({ data });

  const rawVehicleMake = data?.vehicleMake;
  // console.log({ rawVehicleMake });

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

  return {
    loading: loading || refetching,
    error: error || refetchError,
    vehicleMake,
    refetch,
  };
}

export default useGetVehicleMake;
