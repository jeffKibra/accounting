import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

function useSearchBookings() {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);

  const { error: toastError } = useToasts();

  const handleCompleted = useCallback(() => {
    console.log('completing api fetch request...');
    setInitialFetchCompleted(true);
  }, [setInitialFetchCompleted]);

  const {
    loading,
    error,
    data: gqlData,
    refetch,
    called,
  } = useQuery(queries.sales.bookings.LIST_BOOKINGS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: handleCompleted,
  });

  console.log({ gqlData });

  const bookings = gqlData?.bookings;
  // console.log('gql search vehicles result', {
  //   gqlData,
  //   result,
  //   loading,
  //   error,
  //   searchVehicles,
  // });

  const search = useCallback(() => {
    if (initialFetchCompleted) {
      refetch();
    }
  }, [initialFetchCompleted, refetch]);

  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      console.error(error);
      toastError(error?.message || 'Unknown Error');
    }
  }, [failed, error, toastError]);

  return {
    loading,
    error,
    failed,
    search,
    bookings,
    initialFetchCompleted,
  };
}

export default useSearchBookings;
