import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
//
import useToasts from '../useToasts';
//
//
import { mutations } from 'gql';

export default function useDeleteContact(contact, successRoute) {
  const { _id: contactId, displayName, type } = contact;

  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToasts();

  const [deleteInvoice, { called, loading, error, reset }] = useMutation(
    mutations.contacts.DELETE_CONTACT,
    { refetchQueries: ['SearchContacts'] }
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (success) {
      toastSuccess('Deletion Successful!');
      //
      reset();
      //
      navigate(successRoute);
    }
  }, [success, toastSuccess, reset, navigate, successRoute]);

  useEffect(() => {
    if (failed) {
      toastError(error.message);
    }
  }, [failed, error, toastError]);

  function handleDelete() {
    deleteInvoice({
      variables: { id: contactId },
    });
    // dispatch({ type: DELETE_vehicle, payload: vehicleId });
  }

  const details = {
    isDone: success,
    title: 'Delete Contact',
    onConfirm: () => handleDelete(contactId),
    loading,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Contact</Text>
        <Box p={1} pl={5}>
          <Text>
            Contact ID: <b>{contactId}</b>
          </Text>
          <Text>
            Contact Name: <b>{displayName}</b>
          </Text>
          <Text>
            Contact Type: <b>{type}</b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    details,
    handleDelete,
  };
}
