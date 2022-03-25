import { Box, VStack, Text, Spinner } from "@chakra-ui/react";
import PropTypes from "prop-types";

function FullPageSpinner(props) {
  const { label } = props;

  return (
    <Box
      w="full"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack>
        <Text>{label || "Loading..."}</Text>
        <Spinner size="xl" />
      </VStack>
    </Box>
  );
}

FullPageSpinner.propTypes = {
  label: PropTypes.string,
};

export default FullPageSpinner;
