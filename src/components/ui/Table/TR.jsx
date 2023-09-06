import { useContext } from 'react';
import { Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import TableContext from 'contexts/TableContext';

export default function TR(props) {
  // console.log({ TRProps: props });
  const { row, children, ...rowProps } = props;
  // console.log({ rowProps });
  // console.log({ row });

  const { getRowProps, cells, original } = row;

  const {
    highlightedRowBGColor,
    rowFieldToUseAsIdForHighlighting,
    rowIdToHighlight,
    onRowClick,
  } = useContext(TableContext);

  const currentRowId = original[rowFieldToUseAsIdForHighlighting];
  const shouldHighlightRow = rowIdToHighlight === currentRowId;

  // console.log({
  //   currentRowId,
  //   rowIdToHighlight,
  //   shouldHighlightRow,
  //   highlightedRowBGColor,
  // });

  function handleRowClick() {
    typeof onRowClick === 'function' && onRowClick(original);
  }

  return (
    <Tr
      {...(shouldHighlightRow
        ? {
            ...(highlightedRowBGColor
              ? { bgColor: highlightedRowBGColor }
              : {}),
          }
        : {})}
      {...getRowProps()}
      onClick={handleRowClick}
      {...rowProps}
    >
      {children(cells)}
    </Tr>
  );
}

export const TRProps = {
  row: PropTypes.object,
};

TR.propTypes = {
  ...TRProps,
  children: PropTypes.func.isRequired,
};
