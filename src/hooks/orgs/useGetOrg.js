import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
//
import useToasts from '../useToasts';
//
import { orgSuccess } from 'store/slices/orgsSlice';

const { GET_USER_ORG } = queries.orgs;

export default function useGetOrg(options) {
  // const skipFirstFetch = options.skipFirstFetch || false;

  const userProfile = useSelector(state => state?.authReducer?.userProfile);
  console.log('useLoadOrg userProfile:', userProfile);

  const {
    loading,
    called,
    data: result,
    error,
    refetch,
  } = useQuery(GET_USER_ORG, {
    // skip: skipFirstFetch,
    // variables: { id: orgId },
  });

  const { error: toastError } = useToasts();

  useEffect(() => {
    console.log('userProfile has changed');

    if (userProfile) {
      console.log('User profile present: refetching user org...', userProfile);
      refetch();
      // .then(dt => {
      //   const { data } = dt;
      //   console.log('dt', dt);
      // });
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

  console.log({ loading, result, data, error });

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
