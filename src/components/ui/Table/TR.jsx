import { Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function TR(props) {
  // console.log({ TRProps: props });
  const { row, onClick, children, ...rowProps } = props;
  // console.log({ rowProps });
  // console.log({ row });

  const { getRowProps, cells, original } = row;

  function handleRowClick() {
    typeof onClick === 'function' && onClick(original);
  }

  return (
    <Tr {...getRowProps()} onClick={handleRowClick} {...rowProps}>
      {children(cells)}
    </Tr>
  );
}

export const TRProps = {
  onClick: PropTypes.func,
  row: PropTypes.object,
};

TR.propTypes = {
  ...TRProps,
  children: PropTypes.func.isRequired,
};
