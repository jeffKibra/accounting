import React from 'react';
import {
  Container,
  VStack,
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

import ViewSaleItemsTable from '../../../components/tables/Sales/ViewSaleItemTable';
import ViewSaleSummaryTable from '../../../components/tables/Sales/ViewSaleSummaryTable';

function ViewBooking(props) {
  const { booking } = props;
  console.log({ booking });
  const { org, customer, id, saleDate, dueDate, customerNotes, balance } =
    booking;

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
            <VStack align="flex-start" w="full">
              <Heading color="#333" as="h2" size="sm">
                {org?.name}
              </Heading>
              <Text>{org?.address}</Text>
              <Text>{org?.city}</Text>
            </VStack>
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <VStack align="flex-end" w="full">
              <Heading as="h1" size="xl">
                booking
              </Heading>
              <Heading color="#333" size="xs">
                # {id}
              </Heading>
              <VStack w="full" mt="20px!important" align="flex-end">
                <Text fontSize="sm">Balance Due</Text>
                <Heading mt="0px !important" size="sm">
                  KES {Number(balance).toLocaleString()}
                  {}
                </Heading>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>

        <Grid
          mt="30px !important"
          w="full"
          gap={1}
          templateColumns="repeat(12, 1fr)"
        >
          <GridItem colSpan={[12, 6]}>
            <VStack justify="flex-end" align="flex-start" w="full" h="full">
              <Text>Bill To</Text>
              <Heading color="#333" as="h4" size="xs">
                {customer?.displayName}
              </Heading>
            </VStack>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Table size="sm">
              <Tbody>
                <Tr>
                  <Td isNumeric>booking Date:</Td>
                  <Td pr="0px !important" isNumeric>
                    {new Date(saleDate).toDateString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td isNumeric>Due Date:</Td>
                  <Td pr="0px !important" isNumeric>
                    {new Date(dueDate).toDateString()}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </GridItem>
        </Grid>
        <Box w="full" mt="20px!important">
          <ViewSaleItemsTable booking={booking} />
        </Box>
        <Grid w="full" columnGap={3} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[1, 6]}></GridItem>
          <GridItem colSpan={[11, 6]}>
            <ViewSaleSummaryTable showBalance booking={booking} />
          </GridItem>
        </Grid>
        {customerNotes && (
          <VStack align="flex-start" w="full" mt="50px!important">
            <Text>Notes</Text>
            <Text>{customerNotes}</Text>
          </VStack>
        )}
        <Box w="full" minH="200px" />
      </VStack>
    </Container>
  );
}

ViewBooking.propTypes = {
  booking: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    org: PropTypes.object.isRequired,
    saleDate: PropTypes.instanceOf(Date).isRequired,
    dueDate: PropTypes.instanceOf(Date).isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    balance: PropTypes.number.isRequired,
    salesTax: PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
      }),
      PropTypes.string,
    ]),
    bookingRate: PropTypes.number.isRequired,
    bookingTotal: PropTypes.number.isRequired,
    transferAmount: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    // itemTax: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    taxType: PropTypes.string,
  }),
};

export default ViewBooking;
