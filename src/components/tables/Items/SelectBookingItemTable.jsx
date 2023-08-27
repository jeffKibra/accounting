import { useMemo } from 'react';
import PropTypes from 'prop-types';
//
import AdvancedTable from 'components/ui/Table/AdvancedTable';
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
    <AdvancedTable
      data={data}
      columns={columns}
      onRowClick={handleRowClick}
      includeGlobalFilter
      loading={loading}
      error={error}
      {...moreProps}
      bodyRowProps={{
        backgroundColor: theme => {
          console.log('changing bg color', theme);
        },
        cursor: 'pointer',
        transition: 'all 100ms ease-in-out',
        _hover: {
          backgroundColor: 'cyan.50',
        },
        _active: {
          backgroundColor: 'cyan.100',
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
