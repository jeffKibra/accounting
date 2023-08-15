import { Box, IconButton } from '@chakra-ui/react';
import { RiEditLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//

Editable.propTypes = {
  children: PropTypes.node.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default function Editable(props) {
  const { children, onButtonClick } = props;

  return (
    <Box my={4} position="relative">
      <IconButton
        position="absolute"
        right={0}
        top={0}
        variant="ghost"
        icon={<RiEditLine />}
        onClick={onButtonClick}
      />

      {children}
    </Box>
  );
}
