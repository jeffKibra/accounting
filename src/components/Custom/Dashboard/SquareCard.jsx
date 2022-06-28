import React from "react";
import PropTypes from "prop-types";
import {
  VStack,
  Grid,
  GridItem,
  Stat,
  StatHelpText,
  StatNumber,
  StatLabel,
} from "@chakra-ui/react";

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
      <Stat>
        <StatLabel>{cardLabel}</StatLabel>
        <StatNumber>{formats.formatCash(net)}</StatNumber>
        <StatHelpText>Net Value</StatHelpText>
      </Stat>
      <Grid w="full" columnGap={2} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={6}>
          <Piece {...data1} />
        </GridItem>
        <GridItem colSpan={6}>
          <Piece {...data2} />
        </GridItem>
      </Grid>
    </VStack>
  );
}

function Piece(props) {
  const { label, amount } = props;

  return (
    <VStack w="full" align="start">
      <Stat>
        <StatHelpText>{label}</StatHelpText>
        <StatNumber fontSize="md"> {formats.formatCash(amount)}</StatNumber>
      </Stat>
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
