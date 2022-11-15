import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';

import Dialog from 'components/ui/Dialog';

import { DELETE_ACCOUNT } from 'store/actions/accountsActions';
import { reset, chartOfAccountsSuccess } from 'store/slices/accountsSlice';

//----------------------------------------------------------------
DeleteAccount.propTypes = {
  account: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default function DeleteAccount({ account, children }) {
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

  useEffect(() => {
    if (isDeleted) {
      dispatch(reset());
      dispatch(chartOfAccountsSuccess(null));
    }
  }, [isDeleted, dispatch]);

  return (
    <Dialog
      isDone={isDeleted}
      title="Delete Account"
      onConfirm={() => handleDelete(accountId)}
      loading={deleting}
      message={
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
      }
      renderButton={children}
    />
  );
}
