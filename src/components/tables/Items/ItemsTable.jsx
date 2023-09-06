import PropTypes from 'prop-types';

//
import { SearchItemsContextProvider } from 'contexts/SearchItemsContext';
//
import ItemsDisplayTable, {
  ItemsDisplayTablePropTypes,
} from './ItemsDisplayTable';
//
//

function ItemsTable(props) {
  const { idsForItemsToExclude, ...tableProps } = props;
  // console.log({ items });

  return (
    <SearchItemsContextProvider
      idsForItemsToExclude={idsForItemsToExclude || []}
    >
      <ItemsDisplayTable {...tableProps} />
    </SearchItemsContextProvider>
  );
}

const ItemsTablePropTypes = {
  ...ItemsDisplayTablePropTypes,
  idsForItemsToExclude: PropTypes.array,
};

ItemsTable.propTypes = {
  ...ItemsTablePropTypes,
};

export default ItemsTable;
