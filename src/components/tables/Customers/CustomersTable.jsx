import { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
//

import SearchContactsContext from 'contexts/SearchContactsContext';
//
//
import RTTable from 'components/ui/Table/RTTable';
//
import getTableColumns from './getTableColumns';
import getCustomerTableData from './getCustomerTableData';
//

function CustomersDisplayTable(props) {
  // console.log('ITEmsDisplayProps:', props);
  const { onRowClick, enableActions, itemIdToHighlight, ...tableProps } = props;

  const contactsContextData = useContext(SearchContactsContext);
  // console.log({ contactsContextData });

  const {
    loading,
    list,
    error,
    pageCount,
    page,
    count,
    hitsPerPage,
    setHitsPerPage,
    setValueToSearch,
    gotoPage,
    nextPage,
    previousPage,
    // openFiltersModal,
    handleSortByChange,
    // facets,
  } = contactsContextData;

  console.log({ count, pageCount, page, hitsPerPage });

  const rowsAreSelectable = typeof onRowClick === 'function';

  const columns = useMemo(() => {
    const tableColumns = getTableColumns(enableActions);

    return [...tableColumns];
  }, [enableActions]);

  const data = useMemo(() => {
    let customersData = [];

    if (Array.isArray(list)) {
      customersData = list.map(customer => {
        const customerTableData = getCustomerTableData(customer);

        return {
          ...customerTableData,
        };
      });
    }

    return customersData;
  }, [list]);

  // console.log('ITEMSZDISPLAY rerendering...');

  return (
    <>
      <RTTable
        columns={columns}
        data={data}
        //status
        loading={loading}
        error={error}
        //pagination
        pageCount={pageCount}
        pageIndex={page}
        pageSize={hitsPerPage}
        allItemsCount={count}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setHitsPerPage}
        //
        // onFiltersModalOpen={openFiltersModal}
        //
        onSort={handleSortByChange}
        onSearch={setValueToSearch}
        onRowClick={onRowClick}
        rowIdToHighlight={itemIdToHighlight || ''}
        rowFieldToUseAsIdForHighlighting="_id"
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
    </>
  );
}

export const CustomersDisplayTablePropTypes = {
  onRowClick: PropTypes.func,
  enableActions: PropTypes.bool,
  itemIdToHighlight: PropTypes.string,
};

CustomersDisplayTable.propTypes = {
  ...CustomersDisplayTablePropTypes,
};

export default CustomersDisplayTable;
