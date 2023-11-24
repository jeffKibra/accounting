import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
// import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';

//

function useCreateOrg() {
  const [newOrg, { called, loading, reset, error }] = useMutation(
    mutations.orgs.CREATE_ORG
  );

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Org created successfully!');
      //
      reset();
      // navigate(`/`);
    }
  }, [success, toastSuccess, reset]);

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
