import React from "react";
import {
  Container,
  VStack,
  Flex,
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import { getPaymentsTotal } from "../../../utils/payments";

import PaymentInvoicesTable from "../../../components/tables/Payments/PaymentInvoicesTable";

function ViewPayment(props) {
  const { payment } = props;
  const {
    org,
    customer,
    paymentDate,
    paymentMode,
    reference,
    amount,
    payments,
    paidInvoices,
  } = payment;

  const paymentsTotal = getPaymentsTotal(payments);
  const excess = amount - paymentsTotal;

  return (
    <Container
      borderRadius="md"
      shadow="md"
      maxW="container.md"
      //   minH="1123px"
      bg="white"
      px={["20px", "50px"]}
      py="70px"
    >
      <VStack color="#333" w="full" h="full">
        <Grid w="full" gap={1} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[12, 6]}>
            {/* add a logo for the company */}
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <VStack align="flex-end" w="full">
              <Heading color="#333" as="h2" size="sm">
                {org?.name}
              </Heading>
              <Text>{org?.address}</Text>
              <Text>{org?.city}</Text>
            </VStack>
          </GridItem>
        </Grid>

        <Flex mt="30px!important" w="full" justify="center">
          <Heading as="h1" size="md">
            PAYMENT RECEIPT
          </Heading>
        </Flex>

        <Grid
          mt="30px !important"
          w="full"
          gap={1}
          templateColumns="repeat(12, 1fr)"
        >
          <GridItem colSpan={[12, 6]}>
            <Table size="sm">
              <Tbody>
                <Tr>
                  <Td pl={0}>Customer</Td>
                  <Td>{customer?.displayName}</Td>
                </Tr>
                <Tr>
                  <Td pl={0}>Date</Td>
                  <Td>{new Date(paymentDate).toDateString()}</Td>
                </Tr>
                <Tr>
                  <Td pl={0}>Payment Mode</Td>
                  <Td>{paymentMode?.name}</Td>
                </Tr>
                <Tr>
                  <Td pl={0}>Reference#</Td>
                  <Td>{reference}</Td>
                </Tr>
                {excess > 0 && (
                  <Tr>
                    <Td pl={0}>Over Payment</Td>
                    <Td fontWeight="semibold" bg="gray.50">
                      {Number(excess).toLocaleString()}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </GridItem>

          <GridItem
            colSpan={[12, 6]}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <VStack
              w="fit-content"
              bg="cyan.100"
              justify="center"
              align="center"
              p="24px"
              h="130px"
            >
              <Text fontSize="sm">Amount Received</Text>
              <Heading mt="0px !important" size="md">
                KES {Number(amount).toLocaleString()}
                {}
              </Heading>
            </VStack>
          </GridItem>
        </Grid>

        <Flex w="full" pt="50px">
          <Heading size="md" color="gray.600">
            Payment For
          </Heading>
        </Flex>

        <Box w="full" pt={3}>
          <PaymentInvoicesTable invoices={paidInvoices} payments={payments} />
        </Box>

        <Box w="full" minH="200px" />
      </VStack>
    </Container>
  );
}

ViewPayment.propTypes = {
  payment: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    org: PropTypes.object.isRequired,
    amount: PropTypes.number.isRequired,
    paymentDate: PropTypes.instanceOf(Date).isRequired,
    paymentId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    paidInvoices: PropTypes.array.isRequired,
    payments: PropTypes.object.isRequired,
    reference: PropTypes.string,
  }),
};

export default ViewPayment;
