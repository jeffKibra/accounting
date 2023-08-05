import { useMemo } from 'react';
import PropTypes from 'prop-types';

import ItemsOptions from '../../../containers/Management/Items/ItemOptions';

import CustomTable from '../CustomTable';
import AdvancedTable from 'components/ui/Table/AdvancedTable';

function createTaxDisplay(tax) {
  return tax?.name ? `${tax?.name} (${tax?.rate}%)` : '';
}

function ItemsTable(props) {
  const { items } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      { Header: 'Registration', accessor: 'name' },
      // { Header: 'Unique Identifier', accessor: 'sku' },
      { Header: 'Make', accessor: 'carMake' },
      { Header: 'Model', accessor: 'carModel' },
      { Header: 'Rate', accessor: 'rate', isNumeric: true },
      // { Header: 'Type', accessor: 'type' },
      // { Header: 'Cost', accessor: 'costPrice', isNumeric: true },
      // { Header: 'Tax', accessor: 'tax' },
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map(item => {
      const { model: modelDetails, year } = item;
      const { make, model } = modelDetails;
      return {
        ...item,
        carModel: `${model} (${year})`,
        carMake: make,
        tax: createTaxDisplay(item?.salesTax),
        actions: <ItemsOptions item={item} edit view deletion />,
      };
    });
  }, [items]);

  return <AdvancedTable data={data} columns={columns} />;
  //  return <CustomTable data={data} columns={columns} />;
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
