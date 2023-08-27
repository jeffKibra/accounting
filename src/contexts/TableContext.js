import { createContext } from 'react';
import PropTypes from 'prop-types';

const defaultValues = {
  rowFieldToUseAsIdForHighlighting: '',
  highlightedRowBGColor: '',
  rowIdToHighlight: '',
};

const TableContext = createContext(defaultValues);
export default TableContext;

//----------------------------------------------------------------
TableContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  rowFieldToUseAsIdForHighlighting: PropTypes.string,
  highlightedRowBGColor: PropTypes.string,
  rowIdToHighlight: PropTypes.string,
};

export function TableContextProvider(props) {
  console.log({ props });

  const {
    children,
    rowFieldToUseAsIdForHighlighting,
    highlightedRowBGColor,
    rowIdToHighlight,
  } = props;

  return (
    <TableContext.Provider
      value={{
        rowFieldToUseAsIdForHighlighting,
        highlightedRowBGColor,
        rowIdToHighlight,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}
