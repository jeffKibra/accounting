import React from 'react';
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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import { bookingProps, datePropType } from 'propTypes';

import { getPaymentsTotal } from '../../../utils/payments';

import BookingsTable from 'components/tables/Bookings/BookingsTable';

function ViewPayment(props) {
  const { payment, bookings } = props;
  const {
    org,
    customer,
    paymentDate,
    paymentMode,
    reference,
    amount,
    payments,
    paymentId,
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
      px={['20px', '50px']}
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

        <VStack mt="30px!important" w="full" justify="center">
          <Heading as="h1" size="md">
            PAYMENT RECEIPT
          </Heading>
          <Text mt="0px!important" fontSize="sm">
            {paymentId}
          </Text>
        </VStack>

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
            justifyContent={['center', 'flex-end']}
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
          {/* <PaymentBookingsTable bookings={bookings} payments={payments} /> */}
          <BookingsTable
            bookings={bookings}
            payments={payments}
            columnsToExclude={['paymentInput', 'actions', 'imprest', 'balance']}
            paymentId={paymentId}
          />
        </Box>

        <Box w="full" minH="200px" />
      </VStack>
    </Container>
  );
}

ViewPayment.propTypes = {
  payment: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    orgId: PropTypes.string,
    amount: PropTypes.number.isRequired,
    paymentDate: datePropType,
    paymentId: PropTypes.string.isRequired,
    status: PropTypes.number,
    payments: PropTypes.object.isRequired,
    reference: PropTypes.string,
  }),
  bookings: PropTypes.arrayOf(bookingProps),
};

export default ViewPayment;
