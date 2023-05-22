import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, IconButton } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line } from 'react-icons/ri';

import CustomTable from '../CustomRawTable';
// import CustomModal from "../../ui/CustomModal";
// import SelectItemForm from "../../forms/Sales/SelectItemForm";

function SaleItemsTable(props) {
  const { items, handleItemDelete, handleItemEdit, loading, taxType } = props;
  console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: 'Name', accessor: 'displayName' },
      { Header: 'Quantity', accessor: 'quantityString', isNumeric: true },
      { Header: 'Rate', accessor: 'itemRate', isNumeric: true },
      { Header: 'Tax', accessor: 'tax', isNumeric: true },
      { Header: 'Amount', accessor: 'totalAmount', isNumeric: true },
      { Header: '', accessor: 'actions' },
    ];
  }, []);

  const data = useMemo(() => {
    return [...items].map((saleItem, index) => {
      console.log({ saleItem });
      const {
        item,
        salesTax,
        itemRateTotal,
        itemTaxTotal,
        itemRate,
        itemTax,
        quantity,
      } = saleItem;

      const rate = taxType === 'taxInclusive' ? itemRate + itemTax : itemRate;
      const amount =
        taxType === 'taxInclusive'
          ? itemRateTotal + itemTaxTotal
          : itemRateTotal;

      const itemName = item?.name || '';
      const itemUnit = item?.unit || '';

      return {
        ...saleItem,
        itemRate: rate,
        totalAmount: amount,
        displayName: `${itemName}`,
        quantityString: `${quantity} ${itemUnit}`,
        tax: salesTax?.name ? `${salesTax?.name} (${salesTax?.rate}%)` : '0%',
        actions: (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="xs"
              onClick={() => handleItemEdit(saleItem, index)}
              colorScheme="cyan"
              icon={<RiEdit2Line />}
              title="Edit"
              isDisabled={loading}
            />

            <IconButton
              size="xs"
              onClick={() => handleItemDelete(index)}
              colorScheme="red"
              icon={<RiDeleteBin4Line />}
              title="Delete"
              isDisabled={loading}
            />
          </Stack>
        ),
      };
    });
  }, [items, handleItemDelete, handleItemEdit, loading, taxType]);

  return <CustomTable data={data} columns={columns} />;
}

SaleItemsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.object.isRequired,
      dateRange: PropTypes.array,
      rate: PropTypes.number.isRequired,
      tax: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.string,
          rate: PropTypes.number,
          taxId: PropTypes.string,
        }),
      ]),
      itemRateTotal: PropTypes.number.isRequired,
      itemRate: PropTypes.number.isRequired,
      itemTax: PropTypes.number.isRequired,
      itemTaxTotal: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  handleItemDelete: PropTypes.func.isRequired,
  handleItemEdit: PropTypes.func.isRequired,
  taxType: PropTypes.string.isRequired,
};

export default SaleItemsTable;
