import { useEffect } from 'react';
import PropTypes from 'prop-types';
//
import { useGetItems } from 'hooks';
//
import ItemsDisplayTable from './ItemsDisplayTable';

//

function AlgoliaItemsTable(props) {
  const { onRowClick, idsForItemsToExclude } = props;
  console.log({ onRowClick });

  const { loading, error, items, getItems } = useGetItems(idsForItemsToExclude);

  useEffect(() => {
    console.log('fetching items onmount...');
    getItems();
  }, [getItems]);

  function handleSortByChange(array) {
    console.log({ array });
  }

  return (
    <ItemsDisplayTable
      loading={loading}
      error={error}
      items={items}
      onRowClick={onRowClick}
      onSort={handleSortByChange}
      onSearch={getItems}
    />
  );
}

AlgoliaItemsTable.propTypes = {
  idsForItemsToExclude: PropTypes.array,
  onRowClick: PropTypes.func,
};

AlgoliaItemsTable.defaultProps = {
  idsForItemsToExclude: [],
  onRowClick: () => {},
};

export default AlgoliaItemsTable;
