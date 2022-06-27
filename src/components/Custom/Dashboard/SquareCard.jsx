import React from "react";
import PropTypes from "prop-types";
import { VStack, Heading, Text } from "@chakra-ui/react";

import formats from "../../../utils/formats";

function SquareCard(props) {
  const { data1, data2, cardLabel } = props;
  const net = data1.amount - data2.amount;
  return (
    <VStack
      align="flex-start"
      w="full"
      bg="white"
      p={4}
      shadow="md"
      borderRadius="md"
      //   minH="300px"
    >
      <Heading size="xs">{cardLabel}</Heading>
      <Heading size="md">{formats.formatCash(net)}</Heading>
      <Text fontSize="xs" mt="0px!important">
        Net Value
      </Text>
      <Piece {...data1} />
      <Piece {...data2} />
    </VStack>
  );
}

function Piece(props) {
  const { label, amount } = props;

  return (
    <VStack w="full" align="start">
      <Text color="gray.900" fontSize="sm">
        {label}
      </Text>
      <Heading color="gray.800" size="sm">
        {formats.formatCash(amount)}
      </Heading>
    </VStack>
  );
}

SquareCard.propTypes = {
  data1: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  data2: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  cardLabel: PropTypes.string.isRequired,
};

export default SquareCard;
