import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_ACCOUNT } from '../store/actions/accountsActions';

import { reset } from '../store/slices/accountsSlice';

export default function useDeleteAccount(account) {
  const { accountId, name, accountType } = account;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.accountsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_ACCOUNT;

  function handleDelete() {
    dispatch({ type: DELETE_ACCOUNT, payload: accountId });
  }

  function resetAccount() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
    title: 'Delete Account',
    onConfirm: () => handleDelete(accountId),
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Account?</Text>
        <Box p={1} pl={5}>
          <Text>
            Account ID: <b>{accountId}</b>
          </Text>
          <Text>
            Account Name: <b>{name}</b>
          </Text>
          <Text>
            Account Type: <b>{accountType?.name}</b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    deleting,
    isDeleted,
    details,
    handleDelete,
    resetAccount,
  };
}
