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
  } = useContext(InvoicesContext);
  const { nextStep } = useContext(StepperContext);
  const toasts = useToasts();

  function saveItems() {
    if (selectedItems.length === 0) {
      return toasts.error("You must add atleast one item to an Invoice!");
    }

    nextStep();
  }

  return (
    <VStack mt="0px !important" maxW="full">
      <AddItem loading={loading} addItem={addItem} items={items || []} />

      <AddedItemsTable
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

      <Flex mt={4} pb={5}>
        <Button mt={4} colorScheme="cyan" onClick={saveItems}>
          next
        </Button>
      </Flex>
    </VStack>
  );
}

export default InvoiceItems;
