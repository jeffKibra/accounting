import { useMemo } from 'react';
import PropTypes from 'prop-types';
//
import SkeletonLoader from 'components/ui/SkeletonLoader';
//
import RTTable from 'components/ui/Table/RTTable';
//
import tableColumns from './tableColumns';
//
import getItemTableData from './getItemTableData';

//

function ItemsDisplayTable(props) {
  // console.log('ITEmsDisplayProps:', props);
  const { items, loading, error, onSearch, onRowClick, onSort, ...tableProps } =
    props;

  const rowsAreSelectable = typeof onRowClick === 'function';

  const columns = useMemo(() => {
    return [
      ...tableColumns,
      { Header: '', accessor: 'actions', isNumeric: true, width: '1%' },
    ];
  }, []);

  const data = useMemo(() => {
    let itemsData = [];

    if (Array.isArray(items)) {
      itemsData = items.map(item => {
        const itemTableData = getItemTableData(item);

        return {
          ...itemTableData,
          // actions: <ItemsOptions item={item} edit view deletion schedule />,
        };
      });
    }

    return itemsData;
  }, [items]);

  function handleSortByChange(array) {
    console.log({ array });

    typeof onSort === 'function' && onSort(array[0]);
  }

  console.log('ITEMSZDISPLAY rerendering...');

  return loading ? (
    <SkeletonLoader />
  ) : (
    <RTTable
      loading={loading}
      error={error}
      columns={columns}
      data={data}
      onSortByChange={handleSortByChange}
      onSearch={onSearch}
      onRowClick={onRowClick}
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

ItemsDisplayTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onSearch: PropTypes.func,
  onRowClick: PropTypes.func,
  onSort: PropTypes.func,
};

export default ItemsDisplayTable;
