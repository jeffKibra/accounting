import { useContext } from "react";
import { VStack, Flex, Button, Grid, GridItem } from "@chakra-ui/react";

import InvoicesContext from "../../../contexts/InvoicesContext";
import StepperContext from "../../../contexts/StepperContext";

import useToasts from "../../../hooks/useToasts";

import AddItem from "../../../components/Custom/Invoices/AddItem";
import AddedItemsTable from "../../../components/tables/Invoices/AddedItemsTable";
import SummaryTable from "../../tables/Invoices/SummaryTable";

function InvoiceItems() {
  const {
    addItem,
    items,
    removeItem,
    selectedItems,
    summary,
    setAdjustment,
    setShipping,
    loading,
    finish,
  } = useContext(InvoicesContext);
  const { prevStep } = useContext(StepperContext);
  const toasts = useToasts();

  function saveItems() {
    if (selectedItems.length === 0) {
      return toasts.error("You must add atleast one item to an Invoice!");
    }

    finish();
  }

  return (
    <VStack mt="0px !important" maxW="full">
      <AddItem loading={loading} addItem={addItem} items={items || []} />

      <AddedItemsTable
        loading={loading}
        handleEdit={addItem}
        handleDelete={removeItem}
        items={selectedItems}
      />

      <Grid w="full" rowGap={4} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[1, 4, 6]}></GridItem>
        <GridItem
          colSpan={[11, 8, 6]}
          bg="white"
          p={4}
          borderRadius="md"
          shadow="md"
        >
          <SummaryTable
            loading={loading}
            summary={summary}
            setAdjustment={setAdjustment}
            setShipping={setShipping}
          />
        </GridItem>
      </Grid>

      <Flex w="full" py={4} justify="space-evenly">
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          onClick={prevStep}
        >
          prev
        </Button>
        <Button isLoading={loading} colorScheme="cyan" onClick={saveItems}>
          save
        </Button>
      </Flex>
    </VStack>
  );
}

export default InvoiceItems;
