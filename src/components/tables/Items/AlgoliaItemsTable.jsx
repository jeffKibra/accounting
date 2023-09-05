import { useEffect } from 'react';
import PropTypes from 'prop-types';
//
import { useGetItems } from 'hooks';
//
import ItemsDisplayTable from './ItemsDisplayTable';

//

function AlgoliaItemsTable(props) {
  const { onRowClick, idsForItemsToExclude } = props;
  // console.log({ onRowClick });

  const {
    loading,
    error,
    items,
    pageCount,
    pageIndex,
    fullListLength,
    hitsPerPage,
    setHitsPerPage,
    setPageIndex,
    search,
  } = useGetItems(idsForItemsToExclude);

  useEffect(() => {});

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
      onSearch={search}
      gotoPage={setPageIndex}
      pageSize={hitsPerPage}
      setPageSize={setHitsPerPage}
      pageIndex={pageIndex}
      pageCount={pageCount}
      allItemsCount={fullListLength}
      onFilter={() => {}}
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
