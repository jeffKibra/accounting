import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteAccount from '../../../hooks/useDeleteAccount';

import MenuOptions from '../../../components/ui/MenuOptions';

function AccountsOptions(props) {
  const { account, edit, view, deletion } = props;
  const { accountId } = account;
  const { details, isDeleted, resetAccount } = useDeleteAccount(account);

  useEffect(() => {
    if (isDeleted) {
      resetAccount();
    }
  }, [isDeleted, resetAccount]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/accountss/${accountId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/accountss/${accountId}/edit`,
          },
        ]
      : []),
    ...(deletion
      ? [
          {
            name: 'Delete',
            icon: RiDeleteBin4Line,
            dialogDetails: {
              ...details,
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

AccountsOptions.propTypes = {
  accounts: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default AccountsOptions;
