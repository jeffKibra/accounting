import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
//
import { orgSuccess } from 'store/slices/orgsSlice';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';

//

function useCreateOrg() {
  const [newOrg, { called, loading, reset, error, data: rawData }] =
    useMutation(mutations.orgs.CREATE_ORG);

  const dispatch = useDispatch();

  console.log({ rawData });
  const orgData = rawData?.createOrg;

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success && orgData) {
      toastSuccess('Org created successfully!');
      //
      // reset();
      // navigate(`/`);
      dispatch(orgSuccess(orgData));
    }
  }, [success, toastSuccess, reset, orgData, dispatch]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createOrg = useCallback(
    formData => {
      //   console.log({ formData });
      newOrg({
        variables: {
          formData,
        },
      });
    },
    [newOrg]
  );

  return {
    loading,
    error,
    reset,
    success,
    failed,
    createOrg,
  };
}

export default useCreateOrg;
