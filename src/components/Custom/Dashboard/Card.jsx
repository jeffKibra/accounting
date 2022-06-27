import React from "react";
import PropTypes from "prop-types";
import { VStack, Heading, Text } from "@chakra-ui/react";

function Card(props) {
  const { amount, label } = props;

  return (
    <VStack w="full" bg="white" p={4} shadow="md" borderRadius="md">
      <Heading color="gray.800" size="md">
        {amount}
      </Heading>
      <Text color="gray.900" fontSize="sm">
        {label}
      </Text>
    </VStack>
  );
}

Card.propTypes = {
  amount: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default Card;
