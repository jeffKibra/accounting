import { createContext, useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { UPDATE_ACCOUNT } from 'store/actions/accountsActions';

const defaultValues = {
  handleFormSubmit: () => {},
  onOpen: () => {},
  onClose: () => {},
  isOpen: false,
  loading: false,
  account: null,
  editAccount: () => {},
};

const EditAccountContext = createContext(defaultValues);
export default EditAccountContext;

//----------------------------------------------------------------
EditAccountContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function EditAccountContextProvider({ children }) {
  const [account, setAccount] = useState(null);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const dispatch = useDispatch();
  const { loading, isModified } = useSelector(
    state => state.chartOfAccountsReducer
  );

  useEffect(() => {
    if (account) {
      onOpen();
    } else {
      onClose();
    }
  }, [account, onOpen, onClose]);

  useEffect(() => {
    if (isModified) {
      onClose();
    }
  }, [isModified, onClose]);

  // console.log({ orgId, loading });

  async function handleFormSubmit(data) {
    const accountId = account?.accountId || '';
    dispatch({ type: UPDATE_ACCOUNT, payload: { ...data, accountId } });
  }

  // console.log({ account, isOpen });

  return (
    <EditAccountContext.Provider
      value={{
        handleFormSubmit,
        isOpen,
        onOpen,
        onClose,
        loading,
        account,
        editAccount: setAccount,
      }}
    >
      {children}
    </EditAccountContext.Provider>
  );
}
