import { Button, useDisclosure } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import { connect } from 'react-redux';

import { CREATE_ACCOUNT } from 'store/actions/accountsActions';

import ModalForm from 'components/forms/Accounts/ModalForm';

function CreateAccount() {
  const { isOpen, onClose, onOpen } = useDisclosure();

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
        loading={false}
      />
    </>
  );
}

function mapStateToProps(state) {
  const { loading, accounts, error } = state.accountsReducer;

  return { loading, accounts, error };
}

function mapDispatchToProps(dispatch) {
  return {
    create: formData => dispatch({ type: CREATE_ACCOUNT, payload: formData }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
