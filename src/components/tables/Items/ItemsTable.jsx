import PropTypes from 'prop-types';

//
//
import ItemsDisplayTable, {
  ItemsDisplayTablePropTypes,
} from './ItemsDisplayTable';
//
//

function ItemsTable(props) {
  const { selectedDates, ...tableProps } = props;
  // console.log({ items });

  return <ItemsDisplayTable {...tableProps} />;
}

const ItemsTablePropTypes = {
  ...ItemsDisplayTablePropTypes,
  selectedDates: PropTypes.array,
};

ItemsTable.propTypes = {
  ...ItemsTablePropTypes,
};

export default ItemsTable;
