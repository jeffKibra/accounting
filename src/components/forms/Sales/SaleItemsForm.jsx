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
import { useForm, FormProvider } from "react-hook-form";

import SalesContext from "../../../contexts/SalesContext";
import StepperContext from "../../../contexts/StepperContext";

import useToasts from "../../../hooks/useToasts";

import SaleItemsTable from "../../tables/Sales/SaleItemsTable";
import SaleSummaryTable from "../../tables/Sales/SaleSummaryTable";
import AddItem from "../../Custom/Sales/AddItem";

import CustomSelect from "../../ui/CustomSelect";

function SaleItemsForm(props) {
  const {
    addItem,
    items,
    removeItem,
    selectedItems,
    summary,
    loading,
    finish,
    formValues,
    updateFormValues,
  } = useContext(SalesContext);
  const { prevStep, nextStep, activeStep, totalSteps } =
    useContext(StepperContext);
  const isLastStep = activeStep === totalSteps - 1;

  const toasts = useToasts();
  const [portalNode, setPortalNode] = useState(null);

  const onRefChange = useCallback((node) => {
    setPortalNode(node);
  }, []);

  const formMethods = useForm({
    mode: "onBlur",
    defaultValues: {
      taxType: formValues?.summary?.taxType || "taxExclusive",
      shipping: formValues?.summary?.shipping || 0,
      adjustment: formValues?.summary?.adjustment || 0,
    },
  });
  const { handleSubmit, watch, getValues } = formMethods;

  const taxType = watch("taxType");
  const shipping = watch("shipping");
  const adjustment = watch("adjustment");

  const { subTotal, totalTaxes } = summary;
  const totalAmount = subTotal + totalTaxes + +shipping + +adjustment;

  function newSummary(data) {
    return {
      ...summary,
      ...data,
      totalAmount,
    };
  }

  function goBack() {
    const allValues = getValues();
    const saleSummary = newSummary(allValues);
    updateFormValues({
      summary: saleSummary,
    });
    prevStep();
  }

  function goNext(saleSummary) {
    updateFormValues({ summary: saleSummary });
    nextStep();
  }

  function save(data) {
    // console.log("submitting form");
    if (selectedItems.length === 0) {
      return toasts.error("Please add atleast one(1) item to proceed!");
    }
    if (totalAmount <= 0) {
      return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    }

    const saleSummary = newSummary(data);

    isLastStep ? finish({ summary: saleSummary }) : goNext(saleSummary);
  }

  return (
    <VStack mt="0px !important" maxW="full">
      <AddItem loading={loading} addItem={addItem} items={items || []} />
      <Flex ref={onRefChange} w="full" />

      <SaleItemsTable
        loading={loading}
        handleEdit={addItem}
        handleDelete={removeItem}
        items={selectedItems}
        taxType={taxType}
      />

      <FormProvider {...formMethods}>
        <Box as="form" role="form" w="full" onSubmit={handleSubmit(save)}>
          {portalNode &&
            createPortal(
              <Flex w="full" justify="flex-end" align="center">
                <Text mr={1} fontSize="sm">
                  Amounts are
                </Text>
                <Box w="140px">
                  <CustomSelect
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
            <Button
              isLoading={loading}
              variant="outline"
              colorScheme="cyan"
              onClick={goBack}
            >
              back
            </Button>
            <Button type="submit" isLoading={loading} colorScheme="cyan">
              {isLastStep ? "save" : "next"}
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </VStack>
  );
}

export default SaleItemsForm;
