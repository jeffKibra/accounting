import { Button, useDisclosure } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { httpsCallable } from 'firebase/functions';

import { functions } from 'utils/firebase';
import {
  start,
  fail,
  chartOfAccountsSuccess,
} from 'store/slices/accountsSlice';
//hooks
import { useCustomToast } from 'hooks';

import ModalForm from 'components/forms/Accounts/ModalForm';

function create(orgId, formData) {
  return httpsCallable(functions, 'books-accounts-create')({ orgId, formData });
}

export default function CreateAccount() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { showToast } = useCustomToast();

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.accountsReducer);
  const orgId = useSelector(state => state.orgsReducer?.org?.orgId);

  // console.log({ orgId, loading });

  async function handleSubmit(data) {
    try {
      dispatch(start());

      // console.log({ data });
      const result = await create(orgId, data);
      console.log({ result });

      dispatch(chartOfAccountsSuccess(null));
      showToast('Successfully created account!');
    } catch (error) {
      console.error(error);
      dispatch(fail(error));
      showToast(error?.message || 'unknown error!', { status: 'error' });
    }

    onClose();
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
