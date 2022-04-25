import { Flex, Text, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

import emptyImage from "../../statics/images/empty.svg";

function Empty(props) {
  const { message } = props;

  return (
    <Flex w="full" justify="center" position="relative">
      <Image
        width="200px"
        height="200px"
        src={emptyImage}
        alt="no data image"
      />
      <Flex
        justify="center"
        alignItems="flex-end"
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
      >
        <Text>{message || "No Data!"}</Text>
      </Flex>
    </Flex>
  );
}

Empty.propTypes = {
  message: PropTypes.node,
};

export default Empty;
