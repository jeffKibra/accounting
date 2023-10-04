import { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
//

import SearchItemsContext from 'contexts/SearchItemsContext';
//
import { useGetItems } from 'hooks';
//
import RTTable from 'components/ui/Table/RTTable';
//
import getTableColumns from './getTableColumns';
import getItemTableData from './getItemTableData';
//
import ItemsFilters from './ItemsFilters';

//

function ItemsDisplayTable(props) {
  // console.log('ITEmsDisplayProps:', props);
  const { onRowClick, enableActions, itemIdToHighlight, ...tableProps } = props;

  const itemsContext = useContext(SearchItemsContext);
  // console.log({ itemsContext });

  useGetItems();

  const {
    loading,
    items,
    error,
    pageCount,
    pageIndex,
    fullListLength,
    hitsPerPage,
    setHitsPerPage,
    setValueToSearch,
    gotoPage,
    nextPage,
    previousPage,
  } = itemsContext;

  const rowsAreSelectable = typeof onRowClick === 'function';

  const columns = useMemo(() => {
    const tableColumns = getTableColumns(enableActions);

    return [...tableColumns];
  }, [enableActions]);

  const data = useMemo(() => {
    let itemsData = [];

    if (Array.isArray(items)) {
      itemsData = items.map(item => {
        const itemTableData = getItemTableData(item, enableActions);

        return {
          ...itemTableData,
          // actions: <ItemsOptions item={item} edit view deletion schedule />,
        };
      });
    }

    return itemsData;
  }, [items, enableActions]);

  function handleSortByChange(array) {
    console.log({ array });
  }

  // console.log('ITEMSZDISPLAY rerendering...');

  return (
    <RTTable
      columns={columns}
      data={data}
      //status
      loading={loading}
      error={error}
      //pagination
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={hitsPerPage}
      allItemsCount={fullListLength}
      gotoPage={gotoPage}
      nextPage={nextPage}
      previousPage={previousPage}
      setPageSize={setHitsPerPage}
      //
      FiltersComponent={<ItemsFilters />}
      //
      onSortByChange={handleSortByChange}
      onSearch={setValueToSearch}
      onRowClick={onRowClick}
      rowIdToHighlight={itemIdToHighlight || ''}
      rowFieldToUseAsIdForHighlighting="itemId"
      highlightedRowBGColor="cyan.50"
      {...(rowsAreSelectable
        ? {
            bodyRowProps: {
              cursor: 'pointer',
              transition: 'all 100ms ease-in-out',
              _hover: {
                backgroundColor: 'cyan.100',
              },
              _active: {
                backgroundColor: 'cyan.200',
              },
            },
          }
        : {})}
      {...tableProps}
    />
  );
}

export const ItemsDisplayTablePropTypes = {
  onRowClick: PropTypes.func,
  enableActions: PropTypes.bool,
  itemIdToHighlight: PropTypes.string,
};

ItemsDisplayTable.propTypes = {
  ...ItemsDisplayTablePropTypes,
};

export default ItemsDisplayTable;
