import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

const { LIST_INVOICES } = queries.sales.invoices;

function useListInvoices() {
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
  } = useQuery(LIST_INVOICES, {
    fetchPolicy: 'cache-and-network',
    onCompleted: handleCompleted,
  });

  console.log({ result });

  const invoices = result?.invoices;
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
    invoices,
    initialFetchCompleted,
  };
}

export default useListInvoices;
