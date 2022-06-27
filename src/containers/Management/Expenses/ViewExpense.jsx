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

import ExpenseSummaryTable from "../../../components/tables/Expenses/ExpenseSummaryTable";
import ViewExpenseItemsTable from "../../../components/tables/Expenses/ViewExpenseItemsTable";

function ViewExpense(props) {
  const { expense } = props;
  const {
    vendor,
    expenseDate,
    paymentMode,
    reference,
    summary,
    items,
    paymentAccount,
    taxType,
  } = expense;
  const { totalAmount } = summary;

  return (
    <Container
      borderRadius="md"
      shadow="md"
      maxW="container.md"
      //   minH="1123px"
      bg="white"
      p={["20px", "50px"]}
      // py="70px"
    >
      <Grid color="#333" w="full" gap={1} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <Table size="sm">
            <Tbody>
              {vendor?.displayName && (
                <Tr>
                  <Td pl={0}>Paid To</Td>
                  <Td>{vendor?.displayName}</Td>
                </Tr>
              )}

              <Tr>
                <Td pl={0}>Date</Td>
                <Td>{new Date(expenseDate).toDateString()}</Td>
              </Tr>
              <Tr>
                <Td pl={0}>Payed Through</Td>
                <Td>{paymentAccount?.name}</Td>
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

        <GridItem
          colSpan={[12, 6]}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <VStack
            w="fit-content"
            bg="cyan.100"
            justify="center"
            align="center"
            p="24px"
            h="100px"
          >
            <Text fontSize="sm">Expense Amount</Text>
            <Heading mt="0px !important" size="md">
              KES {Number(totalAmount).toLocaleString()}
              {}
            </Heading>
          </VStack>
        </GridItem>
        <GridItem colSpan={12} pt="30px">
          <Heading size="md" color="gray.600">
            Items{" "}
            <Text fontSize="sm" fontWeight="normal" as="span">
              (Amounts are{" "}
              {taxType === "taxInclusive" ? "Tax Inclusive" : "Tax Exclusive"})
            </Text>
          </Heading>
        </GridItem>
        <GridItem colSpan={12} pt={2}>
          <ViewExpenseItemsTable
            showActions={false}
            taxType={summary.taxType}
            items={items}
            headerBg="gray.100"
          />
        </GridItem>

        <GridItem colSpan={[1, 6]}></GridItem>

        <GridItem colSpan={[11, 6]}>
          <ExpenseSummaryTable summary={summary} />
        </GridItem>
      </Grid>

      <Box w="full" minH="200px" />
    </Container>
  );
}

ViewExpense.propTypes = {
  expense: PropTypes.shape({
    vendor: PropTypes.object.isRequired,
    expenseDate: PropTypes.instanceOf(Date).isRequired,
    expenseId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    reference: PropTypes.string,
    summary: PropTypes.shape({
      totalAmount: PropTypes.number.isRequired,
    }),
    paymentAccount: PropTypes.object.isRequired,
    paymentMode: PropTypes.object.isRequired,
  }),
};

export default ViewExpense;
