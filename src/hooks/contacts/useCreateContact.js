import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
//

//
export function formatContactData(formData) {
  return {
    ...formData,
  };
}

function useCreateContact(gqlMutation, successRoute) {
  const [newContact, { called, loading, reset, error, data }] = useMutation(
    gqlMutation || mutations.contacts.CREATE_CONTACT
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  const createdContactId = data?.createCustomer;
  // console.log({ createdContactId, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Contact created successfully!');
      //
      reset();
      navigate(`${successRoute}/${createdContactId}/view`);
      // navigate(successRoute);
    }
  }, [success, toastSuccess, reset, navigate, successRoute, createdContactId]);

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
