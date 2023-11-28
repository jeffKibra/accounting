import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
import useGetContact from './useGetContact';
import { formatContactData } from './useCreateContact';

function useUpdateContact(contactId) {
  const [modifyContact, { called, loading: updating, reset, error }] =
    useMutation(mutations.contacts.UPDATE_CONTACT);

  const { loading, contact } = useGetContact(contactId);

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !updating && !error;
  const failed = called && !updating && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Contact updated successfully!');
      //
      reset();
      navigate(`/contacts/${contactId}/view`);
    }
  }, [success, toastSuccess, reset, navigate, contactId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const updateContact = useCallback(
    formData => {
      //   console.log({ formData });
      const formattedData = formatContactData(formData);
      modifyContact({
        variables: {
          id: contactId,
          formData: formattedData,
        },
      });
    },
    [contactId, modifyContact]
  );

  return {
    updating,
    error,
    reset,
    success,
    failed,
    updateContact,
    //fetching params
    loading,
    contact,
  };
}

export default useUpdateContact;
