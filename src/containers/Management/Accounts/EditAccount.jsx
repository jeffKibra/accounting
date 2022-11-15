import PropTypes from 'prop-types';
import { useDisclosure } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { httpsCallable } from 'firebase/functions';

import { functions } from 'utils/firebase';
import {
  start,
  fail,
  chartOfAccountsSuccess,
} from 'store/slices/accountsSlice';

import ModalForm from 'components/forms/Accounts/ModalForm';

function update(orgId, accountId, formData) {
  return httpsCallable(
    functions,
    'books-accounts-update'
  )({ orgId, accountId, formData });
}

//--------------------------------- ------------------------------
EditAccount.propTypes = {
  children: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

export default function EditAccount({ children, account }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.accountsReducer);
  const orgId = useSelector(state => state.orgsReducer?.org?.orgId);

  // console.log({ orgId, loading });

  async function handleSubmit(data) {
    try {
      dispatch(start());
      const accountId = account?.accountId;

      // console.log({ data });
      const result = await update(orgId, accountId, data);
      console.log({ result });

      dispatch(chartOfAccountsSuccess(null));
    } catch (error) {
      console.error(error);
      dispatch(fail(error));
    }

    onClose();
  }

  return (
    <>
      {children(onOpen)}

      <ModalForm
        modalTitle="Edit Account"
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
        onSubmit={handleSubmit}
        defaultValues={account}
      />
    </>
  );
}
