import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
// import PropTypes from 'prop-types';

import ItemsOptions from '../../../containers/Management/Items/ItemOptions';
//
import AdvancedTable from 'components/ui/Table/AdvancedTable';
import AlgoliaItemsTable from './AlgoliaItemsTable';
//
//
import getItemTableData from './getItemTableData';
import tableColumns from './tableColumns';
import tableProps from './tableProps';

function ItemsTable(props) {
  const { items, loading, error, enableOptions, onRowClick } = props;
  // console.log({ items });

  const rowsAreSelectable = typeof onRowClick === 'function';

  const columns = useMemo(() => {
    return [
      ...tableColumns,
      ...(enableOptions
        ? [{ Header: '', accessor: 'actions', isNumeric: true, width: '1%' }]
        : []),
    ];
  }, [enableOptions]);

  const data = useMemo(() => {
    return items.map(item => {
      const itemTableData = getItemTableData(item);

      return {
        ...itemTableData,
        actions: <ItemsOptions item={item} edit view deletion schedule />,
      };
    });
  }, [items]);

  return (
    <Box w="full" bg="white" borderRadius="md" shadow="md" py={4}>
      <AlgoliaItemsTable onRowClick={onRowClick} />
      {/* <AdvancedTable
        data={data}
        columns={columns}
        onRowClick={() => {}}
        includeGlobalFilter
        loading={loading}
        error={error}
      /> */}
    </Box>
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
