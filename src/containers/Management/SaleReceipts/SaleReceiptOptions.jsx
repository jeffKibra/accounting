import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteSaleReceipt from '../../../hooks/useDeleteSaleReceipt';

import MenuOptions from '../../../components/ui/MenuOptions';

function SaleReceiptOptions(props) {
  const { saleReceipt, edit, view, deletion } = props;
  const { saleReceiptId } = saleReceipt;
  const { details, isDeleted, resetSaleReceipt } =
    useDeleteSaleReceipt(saleReceipt);

  useEffect(() => {
    if (isDeleted) {
      resetSaleReceipt();
    }
  }, [isDeleted, resetSaleReceipt]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/sale/sales-receipts/${saleReceiptId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/sale/sales-receipts/${saleReceiptId}/edit`,
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
  saleReceipt: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default SaleReceiptOptions;
