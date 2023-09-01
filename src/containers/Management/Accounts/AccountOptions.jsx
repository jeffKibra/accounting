import { useEffect } from 'react';
import {
  RiDeleteBin4Line,
  RiEdit2Line,
  RiEyeLine,
  RiMoreFill,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from '@chakra-ui/react';

import useDeleteAccount from 'hooks/useDeleteAccount';

import EditAccount from './EditAccount';
import DeleteAccount from './DeleteAccount';

function AccountOptions(props) {
  const { account, edit, view, deletion } = props;
  const { accountId } = account;
  const { isDeleted, resetAccount } = useDeleteAccount(account);

  useEffect(() => {
    if (isDeleted) {
      resetAccount();
    }
  }, [isDeleted, resetAccount]);

  return (
    <>
      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Table Options"
            icon={<RiMoreFill />}
            colorScheme="cyan"
            size="sm"
            title="options"
            // variant="outline"
          />
          <MenuList fontSize="md" lineHeight="6">
            {view && (
              <MenuItem
                as={Link}
                to={`/accounts/${accountId}/view`}
                icon={<RiEyeLine />}
              >
                View
              </MenuItem>
            )}

            {edit && (
              <EditAccount account={account}>
                {onModalOpen => (
                  <MenuItem onClick={onModalOpen} icon={<RiEdit2Line />}>
                    Edit
                  </MenuItem>
                )}
              </EditAccount>
            )}

            {deletion && (
              <DeleteAccount account={account}>
                {onDialogOpen => {
                  return (
                    <Box onClick={onDialogOpen}>
                      <MenuItem icon={<RiDeleteBin4Line />}>Delete</MenuItem>
                    </Box>
                  );
                }}
              </DeleteAccount>
            )}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
}

AccountOptions.propTypes = {
  account: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default AccountOptions;
