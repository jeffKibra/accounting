import { useContext } from "react";
import { Box, Flex, Button, Grid, GridItem } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import { useToasts } from "hooks";

import StepperContext from "../../../contexts/StepperContext";

import SaleSummaryTable from "../../tables/Sales/SaleSummaryTable";

function SaleItemsForm(props) {
  const { selectedItems, loading, summary, taxType } = props;

  const toasts = useToasts();

  const { prevStep, nextStep, activeStep, totalSteps } =
    useContext(StepperContext);
  const isLastStep = activeStep === totalSteps - 1;

  const { watch } = useFormContext();

  const shipping = watch("shipping");
  const adjustment = watch("adjustment");

  const { subTotal, totalTax } = summary;
  const totalAmount = subTotal + totalTax + +shipping + +adjustment;

  function next(data) {
    // console.log("submitting form");
    if (selectedItems.length === 0) {
      return toasts.error("Please add atleast one(1) item to proceed!");
    }
    if (totalAmount <= 0) {
      return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    }

    nextStep();
  }

  return (
    <Box w="full">
      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[1, 4, 6]}></GridItem>
        <GridItem
          colSpan={[11, 8, 6]}
          bg="white"
          p={4}
          borderRadius="md"
          shadow="md"
        >
          <SaleSummaryTable
            loading={loading}
            summary={summary}
            taxType={taxType}
            totalAmount={totalAmount}
          />
        </GridItem>
      </Grid>

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
        <Button
          onClick={isLastStep ? () => {} : next}
          type={isLastStep ? "submit" : "button"}
          isLoading={loading}
          colorScheme="cyan"
        >
          {isLastStep ? "save" : "next"}
        </Button>
      </Flex>
    </Box>
  );
}

SaleItemsForm.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  summary: PropTypes.object.isRequired,
  taxType: PropTypes.string.isRequired,
};

export default SaleItemsForm;
