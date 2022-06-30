import { VStack, Spinner, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

function CustomSpinner(props) {
  const { size, children } = props;
  return (
    <VStack justify="center" align="center" w="full">
      <Spinner size={size} />
      <Text>{children}</Text>
    </VStack>
  );
}

CustomSpinner.defaultProps = {
  size: "xl",
};

CustomSpinner.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};

export default CustomSpinner;
