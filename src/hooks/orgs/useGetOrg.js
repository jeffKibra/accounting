import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
//
import useToasts from '../useToasts';
//
import { orgSuccess } from 'store/slices/orgsSlice';

const { GET_USER_ORG } = queries.orgs;

export default function useGetOrg() {
  // const skipFirstFetch = options.skipFirstFetch || false;
  const userProfile = useSelector(state => state?.authReducer?.userProfile);
  // console.log('useLoadOrg userProfile:', userProfile);

  const [refetching, setRefetching] = useState(false);

  const { error: toastError } = useToasts();

  const {
    loading: loadingOrg,
    called,
    data: result,
    error,
    refetch: refetchQuery,
  } = useQuery(GET_USER_ORG);

  const loading = loadingOrg || refetching;

  const refetch = useCallback(async () => {
    setRefetching(true);
    let result = null;

    try {
      result = await refetchQuery();
      // const { data, error } = result;
      // console.log({ data, error });
    } catch (error) {
      toastError(error.message);
    } finally {
      setRefetching(false);
    }

    return result;
  }, [toastError, setRefetching, refetchQuery]);

  useEffect(() => {
    // console.log('userProfile has changed');
    if (userProfile) {
      // console.log('User profile present: refetching user org...', userProfile);
      refetch();
    }
  }, [refetch, userProfile]);

  useEffect(() => {
    if (error) {
      console.error(error);
      toastError(error.message);
    }
  }, [error, toastError]);

  const dispatch = useDispatch();

  const data = result?.userOrg;

  // console.log({ loading, result, data, error });

  useEffect(() => {
    if (data) {
      dispatch(orgSuccess(data));
    }
  }, [dispatch, data]);

  return {
    loading,
    called,
    refetch,
    data,
  };
}
