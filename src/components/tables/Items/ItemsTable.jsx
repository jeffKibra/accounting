import { useMemo } from 'react';
// import PropTypes from 'prop-types';

import ItemsOptions from '../../../containers/Management/Items/ItemOptions';

import AdvancedTable from 'components/ui/Table/AdvancedTable';
//
import getItemTableData from './getItemTableData';
import tableColumns from './tableColumns';
import tableProps from './tableProps';

function ItemsTable(props) {
  const { items, loading, error } = props;
  // console.log({ items });

  const columns = useMemo(() => {
    return [
      ...tableColumns,
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    return items.map(item => {
      const itemTableData = getItemTableData(item);

      return {
        ...itemTableData,
        actions: <ItemsOptions item={item} edit view deletion />,
      };
    });
  }, [items]);

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onRowClick={() => {}}
      includeGlobalFilter
      loading={loading}
      error={error}
    />
  );
}

ItemsTable.propTypes = {
  ...tableProps,

  // actions: PropTypes.shape({
  //   edit: PropTypes.bool.isRequired,
  //   view: PropTypes.bool.isRequired,
  //   delete: PropTypes.bool.isRequired,
  // }),
};

export default ItemsTable;
