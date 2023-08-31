import { useMemo } from 'react';
import PropTypes from 'prop-types';
//
import AdvancedTable from 'components/ui/Table/AdvancedTable';
import AlgoliaItemsTable from './AlgoliaItemsTable';
//
import getItemTableData from './getItemTableData';
import tableColumns from './tableColumns';
import tableProps from './tableProps';

function SelectBookingItemTable(props) {
  const { items, loading, error, onRowClick, selectedItemId, ...moreProps } =
    props;
  // console.log({ items });

  const columns = useMemo(() => tableColumns, []);

  const data = useMemo(() => {
    return items.map(item => getItemTableData(item));
  }, [items]);

  function handleRowClick(rowData) {
    // console.log({ rowData });
    typeof onRowClick === 'function' && onRowClick(rowData);
  }

  return (
    <AlgoliaItemsTable
      data={data}
      columns={columns}
      onRowClick={handleRowClick}
      includeGlobalFilter
      loading={loading}
      error={error}
      {...moreProps}
      rowIdToHighlight={selectedItemId}
      rowFieldToUseAsIdForHighlighting="itemId"
      highlightedRowBGColor="cyan.50"
      bodyRowProps={{
        cursor: 'pointer',
        transition: 'all 100ms ease-in-out',
        _hover: {
          backgroundColor: 'cyan.100',
        },
        _active: {
          backgroundColor: 'cyan.200',
        },
      }}
    />
  );
}

SelectBookingItemTable.propTypes = {
  ...tableProps,
  onRowClick: PropTypes.func,
  selectedItemId: PropTypes.string,
};

export default SelectBookingItemTable;
