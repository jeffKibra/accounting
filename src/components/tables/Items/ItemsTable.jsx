import { useMemo } from 'react';
import PropTypes from 'prop-types';

import ItemsOptions from '../../../containers/Management/Items/ItemOptions';

import CustomTable from '../CustomTable';

function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

function ItemsTable(props) {
  const { items } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Unique Identifier', accessor: 'sku' },
      // { Header: 'Type', accessor: 'type' },
      { Header: 'Rate', accessor: 'rate', isNumeric: true },
      // { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
      // { Header: 'Tax', accessor: 'tax' },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        tax: createTaxDisplay(item?.salesTax),
        actions: <ItemsOptions item={item} edit view deletion />,
      };
    });
  }, [items]);

  return <CustomTable data={data} columns={columns} />;
}

ItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unit: PropTypes.string,
      description: PropTypes.string,
      sku: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['goods', 'services', 'vehicle']).isRequired,
      // costPrice: PropTypes.number.isRequired,
      rate: PropTypes.number.isRequired,
      salesTax: PropTypes.object,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ItemsTable;