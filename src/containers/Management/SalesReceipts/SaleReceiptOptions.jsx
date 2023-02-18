import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteSalesReceipt from '../../../hooks/useDeleteSalesReceipt';

import MenuOptions from '../../../components/ui/MenuOptions';

function SaleReceiptOptions(props) {
  const { salesReceipt, edit, view, deletion } = props;
  const { salesReceiptId } = salesReceipt;
  const { details, isDeleted, resetSalesReceipt } =
    useDeleteSalesReceipt(salesReceipt);

  useEffect(() => {
    if (isDeleted) {
      resetSalesReceipt();
    }
  }, [isDeleted, resetSalesReceipt]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/sale/sales-receipts/${salesReceiptId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/sale/sales-receipts/${salesReceiptId}/edit`,
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

SaleReceiptOptions.propTypes = {
  salesReceipt: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default SaleReceiptOptions;
