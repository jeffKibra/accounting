import { createContext } from 'react';
import PropTypes from 'prop-types';

const defaultValues = {
  rowFieldToUseAsIdForHighlighting: '',
  highlightedRowBGColor: '',
  rowIdToHighlight: '',
  onRowClick: null,
};

const TableContext = createContext(defaultValues);
export default TableContext;

//----------------------------------------------------------------

export const TableContextProviderPropTypes = {
  rowFieldToUseAsIdForHighlighting: PropTypes.string,
  highlightedRowBGColor: PropTypes.string,
  rowIdToHighlight: PropTypes.string,
  onRowClick: PropTypes.func,
};

TableContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  ...TableContextProviderPropTypes,
};

export function TableContextProvider(props) {
  // console.log({ props });

  const {
    children,
    rowFieldToUseAsIdForHighlighting,
    highlightedRowBGColor,
    rowIdToHighlight,
    onRowClick,
  } = props;

  return (
    <TableContext.Provider
      value={{
        rowFieldToUseAsIdForHighlighting,
        highlightedRowBGColor,
        rowIdToHighlight,
        onRowClick,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}
