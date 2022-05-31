import React from "react";
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
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import InvoicePdfItems from "../../../components/tables/Invoices/InvoicePdfItems";
import InvoicePdfSummary from "../../../components/tables/Invoices/InvoicePdfSummary";

function ViewInvoice(props) {
  const { invoice } = props;
  const {
    org,
    customer,
    selectedItems,
    invoiceSlug,
    summary,
    invoiceDate,
    dueDate,
    customerNotes,
  } = invoice;
  const { balance } = summary;
  console.log({ invoice });
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
                INVOICE
              </Heading>
              <Heading color="#333" size="xs">
                # {invoiceSlug}
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
                  <Td isNumeric>Invoice Date:</Td>
                  <Td pr="0px !important" isNumeric>
                    {new Date(invoiceDate).toDateString()}
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
          <InvoicePdfItems items={selectedItems} />
        </Box>
        <Grid w="full" columnGap={3} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[1, 6]}></GridItem>
          <GridItem colSpan={[11, 6]}>
            <InvoicePdfSummary summary={summary} />
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

ViewInvoice.propTypes = {
  invoice: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    org: PropTypes.object.isRequired,
    summary: PropTypes.shape({
      shipping: PropTypes.number.isRequired,
      adjustment: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
      subTotal: PropTypes.number.isRequired,
      totalTaxes: PropTypes.number.isRequired,
      taxes: PropTypes.array.isRequired,
    }),
    invoiceDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    invoiceSlug: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
  }),
};

export default ViewInvoice;
