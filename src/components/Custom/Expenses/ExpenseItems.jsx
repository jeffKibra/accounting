import { useContext } from "react";
import PropTypes from "prop-types";
import { Box, Flex, Button, Grid, GridItem, Text } from "@chakra-ui/react";

import StepperContext from "../../../contexts/StepperContext";

import useToasts from "../../../hooks/useToasts";

import ExpenseItemsTable from "../../tables/Expenses/ExpenseItemsTable";
import ExpenseSummaryTable from "../../tables/Expenses/ExpenseSummaryTable";
import AddExpenseItem from "./AddExpenseItem";

import ControlledSelect from "../../ui/ControlledSelect";

function ExpenseItems(props) {
  const {
    items,
    taxes,
    addItem,
    updateItem,
    removeItem,
    taxType,
    summary,
    loading,
    finish,
    setTaxType,
  } = props;
  const { prevStep, nextStep, activeStep, totalSteps } =
    useContext(StepperContext);
  const isLastStep = activeStep === totalSteps - 1;

  const toasts = useToasts();

  function save(data) {
    // console.log("submitting form");
    if (items.length === 0) {
      return toasts.error("Please add atleast one(1) Item to proceed!");
    }
    const { totalAmount } = summary;
    if (totalAmount <= 0) {
      return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    }

    finish(data);
    nextStep();
  }

  return (
    <Box mt={1} maxW="full">
      <AddExpenseItem loading={loading} addItem={addItem} items={items || []} />

      <Grid w="full" rowGap={1} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={12}>
          <Flex w="full" justify="flex-end" align="center">
            <Text mr={1} fontSize="sm">
              Amounts are
            </Text>
            <Box w="140px">
              <ControlledSelect
                isDisabled={loading}
                defaultValue={taxType || "taxInclusive"}
                size="sm"
                colorScheme="cyan"
                allowClearSelection={false}
                options={[
                  { name: "Inclusive of Tax", value: "taxInclusive" },
                  { name: "Exclusive of Tax", value: "taxExclusive" },
                ]}
                onChange={setTaxType}
                value={taxType}
                id="taxType"
              />
            </Box>
          </Flex>
        </GridItem>

        <GridItem colSpan={12} shadow="md" bg="white" borderRadius="md" py={4}>
          <ExpenseItemsTable
            loading={loading}
            handleEdit={updateItem}
            handleDelete={removeItem}
            items={items}
            taxes={taxes}
          />
        </GridItem>

        <GridItem colSpan={[1, 4, 6]}></GridItem>
        <GridItem
          colSpan={[11, 8, 6]}
          bg="white"
          p={4}
          borderRadius="md"
          shadow="md"
        >
          <ExpenseSummaryTable summary={summary} />
        </GridItem>

        <GridItem colSpan={12}>
          <Flex w="full" py={4} justify="space-evenly">
            {activeStep > 0 && (
              <Button
                isLoading={loading}
                variant="outline"
                colorScheme="cyan"
                onClick={prevStep}
              >
                back
              </Button>
            )}
            <Button onClick={save} isLoading={loading} colorScheme="cyan">
              {isLastStep ? "save" : "next"}
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

ExpenseItems.propTypes = {
  summary: PropTypes.shape({
    subTotal: PropTypes.number.isRequired,
    totalTaxes: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    expenseTaxes: PropTypes.array.isRequired,
  }),
  taxType: PropTypes.string.isRequired,
  removeItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  setTaxType: PropTypes.func.isRequired,
  finish: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  taxes: PropTypes.array,
  loading: PropTypes.bool.isRequired,
};

export default ExpenseItems;
