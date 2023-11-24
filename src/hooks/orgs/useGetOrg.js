import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
//
import useToasts from '../useToasts';
//
import { orgSuccess } from 'store/slices/orgsSlice';

const { GET_USER_ORG } = queries.orgs;

export default function useGetOrg(orgId) {
  const {
    loading,
    called,
    data: result,
    error,
    refetch,
  } = useQuery(GET_USER_ORG, {
    variables: { id: orgId },
  });

  const { error: toastError } = useToasts();

  useEffect(() => {
    if (error) {
      console.error(error);
      toastError(error.message);
    }
  }, [error, toastError]);

  const dispatch = useDispatch();

  console.log({ result });

  const data = result?.userOrg;

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
