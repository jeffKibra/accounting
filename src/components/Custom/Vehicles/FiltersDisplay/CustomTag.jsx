import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function CustomTag(props) {
  const { children, onClose } = props;

  return (
    <Tag borderRadius="full" variant="solid" colorScheme="cyan" mb={2} mr={2}>
      <TagLabel>{children}</TagLabel>
      <TagCloseButton onClick={onClose} />
    </Tag>
  );
}

CustomTag.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomTag;
