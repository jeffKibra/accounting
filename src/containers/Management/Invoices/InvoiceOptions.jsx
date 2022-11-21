import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteInvoice from '../../../hooks/useDeleteInvoice';

import MenuOptions from '../../../components/ui/MenuOptions';

function InvoiceOptions(props) {
  const { invoice, edit, view, deletion } = props;
  const { invoiceId } = invoice;
  const { details, isDeleted, resetInvoice } = useDeleteInvoice(invoice);

  useEffect(() => {
    if (isDeleted) {
      resetInvoice();
    }
  }, [isDeleted, resetInvoice]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/sale/invoices/${invoiceId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/sale/invoices/${invoiceId}/edit`,
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

InvoiceOptions.propTypes = {
  invoice: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};
export default InvoiceOptions;
