import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//
import { CUSTOMERS } from 'nav/routes';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';

//
export function formatContactData(formData) {
  return {
    ...formData,
  };
}

function useCreateContact() {
  const [newContact, { called, loading, reset, error }] = useMutation(
    mutations.contacts.CREATE_CONTACT
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Contact created successfully!');
      //
      reset();
      navigate(CUSTOMERS);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createContact = useCallback(
    formData => {
      //   console.log({ formData });
      const modifiedData = formatContactData(formData);
      newContact({
        variables: {
          formData: modifiedData,
        },
      });
    },
    [newContact]
  );

  return {
    loading,
    error,
    reset,
    success,
    failed,
    createContact,
  };
}

export default useCreateContact;
