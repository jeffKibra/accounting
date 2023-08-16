import { Box, IconButton } from '@chakra-ui/react';
import { RiEditLine, RiCloseLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//

Editable.propTypes = {
  children: PropTypes.node.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export default function Editable(props) {
  const { children, onEditToggle, isEditing } = props;

  return (
    <Box my={4} position="relative">
      <IconButton
        size="sm"
        position="absolute"
        right={0}
        top={0}
        zIndex={100}
        variant="ghost"
        colorScheme={isEditing ? 'red' : ''}
        icon={isEditing ? <RiCloseLine /> : <RiEditLine />}
        onClick={onEditToggle}
      />

      {children}
    </Box>
  );
}
