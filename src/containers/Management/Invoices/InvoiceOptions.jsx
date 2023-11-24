import { useEffect } from 'react';
import {
  RiDeleteBin4Line,
  RiEdit2Line,
  RiEyeLine,
  RiDownloadCloud2Line,
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

import Dialog from 'components/ui/Dialog';

import { useDeleteInvoiceModal } from 'hooks';

import { generatePDF } from 'utils/invoices';

function InvoiceOptions(props) {
  const { invoice, edit, view, deletion, download } = props;

  const { _id: invoiceId, metaData } = invoice;

  const isBooking = metaData?.saleType === 'car_booking';

  const { details, isDeleted, resetInvoice } = useDeleteInvoiceModal(invoice);

  useEffect(() => {
    if (isDeleted) {
      resetInvoice();
    }
  }, [isDeleted, resetInvoice]);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Invoices Options"
        icon={<RiMoreFill />}
        colorScheme="cyan"
        size="sm"
        title="options"
        // variant="outline"
      />
      <MenuList fontSize="md" lineHeight="6">
        {view ? (
          <MenuItem
            as={Link}
            to={`/sale/invoices/${invoiceId}/view`}
            icon={<RiEyeLine />}
          >
            View
          </MenuItem>
        ) : null}

        {edit ? (
          <MenuItem
            as={Link}
            to={`/sale/${
              isBooking ? 'bookings' : 'invoices'
            }/${invoiceId}/edit`}
            icon={<RiEdit2Line />}
          >
            Edit
          </MenuItem>
        ) : null}

        {deletion ? (
          <Dialog
            {...details}
            renderButton={onOpen => {
              return (
                <Box onClick={onOpen}>
                  <MenuItem icon={<RiDeleteBin4Line />}>Delete</MenuItem>
                </Box>
              );
            }}
          />
        ) : null}

        {download ? (
          <MenuItem
            onClick={() => generatePDF(invoice)}
            icon={<RiDownloadCloud2Line />}
          >
            Download
          </MenuItem>
        ) : null}
      </MenuList>
    </Menu>
  );
}

InvoiceOptions.propTypes = {
  invoice: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default InvoiceOptions;
