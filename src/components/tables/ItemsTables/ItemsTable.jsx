import { useMemo } from 'react';
import PropTypes from 'prop-types';

import ItemOptions from '../../../containers/Management/Items/ItemOptions';

import CustomTable from '../CustomTable';

function ItemsTable(props) {
  const { items } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Variant', accessor: 'variant' },
      { Header: 'Unit', accessor: 'unit' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Rate', accessor: 'sellingPrice', isNumeric: true },
      { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        actions: <ItemOptions item={item} edit deletion />,
      };
    });
  }, [items]);

  return <CustomTable data={data} columns={columns} />;
}

ItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['goods', 'services']).isRequired,
      costPrice: PropTypes.number.isRequired,
      sellingPrice: PropTypes.number.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ItemsTable;
