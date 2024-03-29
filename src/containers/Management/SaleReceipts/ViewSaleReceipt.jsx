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

import ViewSaleItemTable from '../../../components/tables/Sales/ViewSaleItemTable';
import ViewSaleSummaryTable from '../../../components/tables/Sales/ViewSaleSummaryTable';
function ViewSaleReceipt(props) {
  const { saleReceipt } = props;
  const {
    org,
    customer,
    receiptDate,
    paymentMode,
    reference,
    summary,
    selectedItems,
    customerNotes,
    saleReceiptId,
  } = saleReceipt;

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
            SALES RECEIPT
          </Heading>
          <Text fontSize="sm" mt="0px!important">
            {saleReceiptId}
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
                  <Td>{new Date(receiptDate).toDateString()}</Td>
                </Tr>
                <Tr>
                  <Td pl={0}>Payment Mode</Td>
                  <Td>{paymentMode?.name}</Td>
                </Tr>
                <Tr>
                  <Td pl={0}>Reference#</Td>
                  <Td>{reference}</Td>
                </Tr>
              </Tbody>
            </Table>
          </GridItem>
        </Grid>

        <Box w="full" mt="20px!important">
          <ViewSaleItemTable taxType={summary.taxType} items={selectedItems} />
        </Box>
        <Grid w="full" columnGap={3} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[1, 6]}></GridItem>
          <GridItem colSpan={[11, 6]}>
            <ViewSaleSummaryTable showBalance={false} summary={summary} />
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

ViewSaleReceipt.propTypes = {
  saleReceipt: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    org: PropTypes.object.isRequired,
    receiptDate: PropTypes.instanceOf(Date).isRequired,
    saleReceiptId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
    reference: PropTypes.string,
    summary: PropTypes.shape({
      totalAmount: PropTypes.number.isRequired,
    }),
  }),
};

export default ViewSaleReceipt;
