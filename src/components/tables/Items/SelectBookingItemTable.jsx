import { useMemo } from 'react';
// import PropTypes from 'prop-types';
//
import AdvancedTable from 'components/ui/Table/AdvancedTable';
//
import getItemTableData from './getItemTableData';
import tableColumns from './tableColumns';
import tableProps from './tableProps';

function SelectBookingItemTable(props) {
  const { items, loading, error } = props;
  // console.log({ items });

  const columns = useMemo(() => tableColumns, []);

  const data = useMemo(() => {
    return items.map(item => getItemTableData(item));
  }, [items]);

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onRowClick={() => {}}
      includeGlobalFilter
      loading={loading}
      error={error}
      bodyRowProps={{
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
  
};

export default SelectBookingItemTable;
