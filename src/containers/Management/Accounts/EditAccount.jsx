import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDisclosure } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';

import { UPDATE_ACCOUNT } from 'store/actions/accountsActions';

import ModalForm from 'components/forms/Accounts/ModalForm';

//--------------------------------- ------------------------------
EditAccount.propTypes = {
  children: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

export default function EditAccount({ children, account }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const dispatch = useDispatch();
  const { loading, isModified } = useSelector(
    state => state.chartOfAccountsReducer
  );

  useEffect(() => {
    if (isModified) {
      onClose();
    }
  }, [isModified, onClose]);

  // console.log({ orgId, loading });

  async function handleSubmit(data) {
    const accountId = account?.accountId || '';
    dispatch({ type: UPDATE_ACCOUNT, payload: { ...data, accountId } });
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
