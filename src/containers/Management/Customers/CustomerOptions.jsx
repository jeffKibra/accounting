import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
//
import { CUSTOMERS } from 'nav/routes';

import { useDeleteContact } from 'hooks';

import MenuOptions from '../../../components/ui/MenuOptions';

function CustomerOptions(props) {
  const { customer, edit, view, deletion } = props;
  const { _id: customerId } = customer;

  const { details } = useDeleteContact(customer, CUSTOMERS);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/customers/${customerId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/customers/${customerId}/edit`,
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

CustomerOptions.propTypes = {
  customer: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default CustomerOptions;
