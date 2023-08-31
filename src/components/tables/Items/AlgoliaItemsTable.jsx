import { useEffect } from 'react';

//
import { useGetItems } from 'hooks';
//
import ItemsDisplayTable from './ItemsDisplayTable';

//

function AlgoliaItemsTable(props) {
  const { onRowClick } = props;

  const { loading, error, items, getItems } = useGetItems();

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

export default AlgoliaItemsTable;
