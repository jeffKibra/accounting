import { useContext, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Flex,
  Button,
  Grid,
  GridItem,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import { useToasts } from "hooks";

import StepperContext from "../../../contexts/StepperContext";

import SaleItemsTable from "../../tables/Sales/SaleItemsTable";
import SaleSummaryTable from "../../tables/Sales/SaleSummaryTable";

import CustomSelect from "../../ui/CustomSelect";

function SaleItemsForm(props) {
  const { selectedItems, loading, summary, removeItem, editItem } = props;

  const toasts = useToasts();

  const { prevStep, nextStep, activeStep, totalSteps } =
    useContext(StepperContext);
  const isLastStep = activeStep === totalSteps - 1;

  const [portalNode, setPortalNode] = useState(null);

  const onRefChange = useCallback((node) => {
    setPortalNode(node);
  }, []);

  const { watch } = useFormContext();

  console.log({ selectedItems });

  const taxType = watch("taxType");
  const shipping = watch("shipping");
  const adjustment = watch("adjustment");

  const { subTotal, totalTaxes } = summary;
  const totalAmount = subTotal + totalTaxes + +shipping + +adjustment;

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
    <>
      <VStack mt="0px !important" maxW="full">
        {/* <AddItem loading={loading} addItem={addItem} items={items || []} /> */}
        <Flex ref={onRefChange} w="full" />

        <SaleItemsTable
          loading={loading}
          handleEdit={editItem}
          handleDelete={removeItem}
          items={selectedItems}
          taxType={taxType}
        />

        <Box w="full">
          {portalNode &&
            createPortal(
              <Flex w="full" justify="flex-end" align="center">
                <Text mr={1} fontSize="sm">
                  Amounts are
                </Text>
                <Box w="140px">
                  <CustomSelect
                    isDisabled={loading}
                    size="sm"
                    colorScheme="cyan"
                    name="taxType"
                    options={[
                      { name: "Inclusive of Tax", value: "taxInclusive" },
                      { name: "Exclusive of Tax", value: "taxExclusive" },
                    ]}
                  />
                </Box>
              </Flex>,
              portalNode
            )}

          <Grid
            w="full"
            rowGap={2}
            columnGap={4}
            templateColumns="repeat(12, 1fr)"
          >
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
      </VStack>
    </>
  );
}

SaleItemsForm.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  summary: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
};

export default SaleItemsForm;
