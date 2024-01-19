import { Flex, Image, Heading } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import emptyImage from '../../statics/images/empty.svg';

function Empty(props) {
  const { message, imageSize, imageWidth, imageHeight } = props;

  return (
    <Flex direction="column" alignItems="center" w="full" justify="center">
      <Image
        width={imageWidth || imageSize}
        height={imageHeight || imageSize}
        src={emptyImage}
        alt="no data image"
      />

      <Flex justify="center" w="full">
        <Heading size="md" as="h5">
          {message || 'No Data!'}
        </Heading>
      </Flex>
    </Flex>
  );
}

Empty.propTypes = {
  message: PropTypes.node,
  imageSize: PropTypes.string,
  imageWidth: PropTypes.string,
  imageHeight: PropTypes.string,
};

Empty.defaultProps = {
  imageSize: '200px',
};

export default Empty;
