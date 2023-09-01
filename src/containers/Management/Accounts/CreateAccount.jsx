import { useEffect } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';

import { CREATE_ACCOUNT } from 'store/actions/accountsActions';

import ModalForm from 'components/forms/Accounts/ModalForm';

export default function CreateAccount() {
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
    return dispatch({ type: CREATE_ACCOUNT, payload: data });
  }

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<RiAddLine />}
        colorScheme="cyan"
        size="sm"
      >
        New Account
      </Button>

      <ModalForm
        modalTitle="Create Account"
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </>
  );
}
