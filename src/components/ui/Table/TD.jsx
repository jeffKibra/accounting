import { Td } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function TD(props) {
  // console.log({ props });
  const { cell, onClick, ...cellProps } = props;

  // console.log({ cell });

  const { getCellProps, render, column, original } = cell;

  function handleClick() {
    typeof onClick === 'function' && onClick(original);
  }

  // console.log(getCellProps(), { cell });
  const { isNumeric, width } = column;

  return (
    <Td
      isNumeric={isNumeric}
      onClick={handleClick}
      {...(width ? { width } : {})}
      {...getCellProps()}
      {...cellProps}
    >
      {render('Cell')}
    </Td>
  );
}

TD.propTypes = {
  cell: PropTypes.object,
  onClick: PropTypes.func,
};
