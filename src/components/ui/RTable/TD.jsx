import { Td } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function TD(props) {
  // console.log({ props });
  const { onClick, children, isNumeric, width, ...cellProps } = props;

  // console.log({ cell });

  function handleClick() {
    typeof onClick === 'function' && onClick(children);
  }

  // console.log(getCellProps(), { cell });

  return (
    <Td
      isNumeric={isNumeric}
      onClick={handleClick}
      {...(width ? { width } : {})}
      {...cellProps}
    >
      {children}
    </Td>
  );
}

TD.propTypes = {
  cell: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  isNumeric: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
