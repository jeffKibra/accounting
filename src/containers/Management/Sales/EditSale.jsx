import { useMemo, useState, useContext } from "react";
import { useFormContext } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Box,
  Flex,
  Text,
  VStack,
  useDisclosure,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";
//contexts
import StepperContext from "contexts/StepperContext";
//hooks
import { useToasts } from "hooks";
//utils
import { getSaleSummary, getSalesItemData } from "utils/sales";
//ui components
import CustomSelect from "components/ui/CustomSelect";
//forms
import SelectItemForm from "components/forms/Sales/SelectItemForm";
//tables
import SaleItemsTable from "components/tables/Sales/SaleItemsTable";
import SaleSummaryTable from "components/tables/Sales/SaleSummaryTable";

export default function EditSale(props) {
  const { loading } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  //contexts
  const { nextStep } = useContext(StepperContext);
  //hooks
  const toasts = useToasts();
  /**
   * convert items into an object for easier updates .
   * helps to avoid iterating the whole array for every update
   */
  const [itemsObject, setItemsObject] = useState(
    props.items.reduce((obj, item) => {
      const { itemId } = item;
      return {
        ...obj,
        [itemId]: item,
      };
    }, {})
  );

  function markItemAsAdded(itemId) {
    setItemsObject((currentItems) => {
      const item = currentItems[itemId];

      //return new object with the item marked as added
      return {
        ...currentItems,
        [itemId]: {
          ...item,
          added: true,
        },
      };
    });
  }

  function unmarkItemAsAdded(itemId) {
    setItemsObject((currentItems) => {
      const item = currentItems[itemId];

      //return new object with the item unmarked as added
      return {
        ...currentItems,
        [itemId]: {
          ...item,
          added: false,
        },
      };
    });
  }

  const [itemToEdit, setItemToEdit] = useState(null);
  // console.log(itemToEdit);

  //form methhods
  const { watch, setValue, register, unregister, getValues } = useFormContext();

  //function to start editing
  function startEditing(itemId) {
    if (itemId) {
      const itemData = getValues(`selectedItems.${itemId}`);
      setItemToEdit(itemData);
    } else {
      //trying to add a new item
      setItemToEdit(null);
    }

    //open editor
    onOpen();
  }

  //function to stop editing
  function stopEditing() {
    //close editor first
    onClose();
    //set item to edit to be null
    setItemToEdit(null);
  }

  function updateItem(editItem) {
    //stop editing-first activity-close the editor firt to avoid ui lagging
    stopEditing();
    //process the data
    const { item, itemId, rate, quantity } = editItem;
    //formulate selected items data
    const itemData = getSalesItemData({ itemId, rate, quantity }, item);
    //check if its an update-check if the itemToEdit is not null
    if (!itemToEdit) {
      //is null-this is a new item, register it first
      register(`selectedItems.${itemId}`);
      //remove item from items list
      markItemAsAdded(itemId);
    }
    //update the field value with item data
    setValue(`selectedItems.${itemId}`, { ...itemData }, { shouldDirty: true });
  }

  function removeItem(itemId) {
    //remove it from form by unregistering
    unregister(`selectedItems.${itemId}`);
    //unmark item
    unmarkItemAsAdded(itemId);
  }

  /**
   * function triggers validation for selected items before moving to the next step
   */
  function next() {
    const selectedItems = getValues("selectedItems");

    const fieldsValid =
      (selectedItems &&
        Object.values(selectedItems).filter((item) => item).length > 0) ||
      false;

    if (!fieldsValid) {
      return toasts.error("Please add atleast one(1) item to proceed!");
    }
    // if (totalAmount <= 0) {
    //   return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    // }

    nextStep();
  }
  /**
   * selected items is a map-convert to array for use in table and summary
   * use watch to get updates
   */
  const formItems = watch("selectedItems");
  /**
   * form items change on every render.
   * to avoid performance issues, convert formItems into a JSON string
   * useMemo and useEffect with be able to compare strings appropriately
   * and only rerender when value changes
   */
  const formItemsString = JSON.stringify(formItems || {});

  //compute summary values whenever selected items change
  const { summary, selectedItems } = useMemo(() => {
    /**
     * parse the json string to get back formItems
     */
    const formItems = JSON.parse(formItemsString);
    //initializa selected items as an empty array
    let selectedItems = [];
    //update selected items based on formItems
    if (formItems && typeof formItems === "object") {
      selectedItems = Object.values(formItems).filter((item) => item);
    }

    console.log("generating summary");
    const summary = getSaleSummary(selectedItems);

    return { summary, selectedItems };
  }, [formItemsString]);

  return (
    <VStack mt={1}>
      <Flex w="full" justify="flex-end" align="center">
        <Text mr={1} fontSize="sm">
          Amounts are
        </Text>
        <Box w="140px">
          <CustomSelect
            isDisabled={loading}
            size="sm"
            colorScheme="cyan"
            name="summary.taxType"
            options={[
              { name: "Inclusive of Tax", value: "taxInclusive" },
              { name: "Exclusive of Tax", value: "taxExclusive" },
            ]}
          />
        </Box>
      </Flex>

      <SaleItemsTable
        loading={loading}
        handleEdit={startEditing}
        handleDelete={removeItem}
        items={selectedItems}
        taxType={watch("summary.taxType")}
      />

      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[1, 4, 6]}></GridItem>
        <GridItem
          colSpan={[11, 8, 6]}
          bg="white"
          p={4}
          borderRadius="md"
          shadow="md"
        >
          <SaleSummaryTable loading={loading} summary={summary} />
        </GridItem>
      </Grid>

      <Flex w="full" py={4} justify="space-evenly">
        <Button
          onClick={next}
          type="button"
          isLoading={loading}
          colorScheme="cyan"
        >
          next
        </Button>
      </Flex>

      {/**
       * components below are out of the normal page ui
       * either a modal
       * or a component with position set to fixed
       */}
      <IconButton
        onClick={() => startEditing(null, null)}
        colorScheme="cyan"
        icon={<RiAddLine />}
        borderRadius="full"
        position="fixed"
        bottom="50px"
        right="30px"
        zIndex="banner"
        title="add item"
        isDisabled={loading}
      />

      <Modal
        onClose={stopEditing}
        // finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        closeOnOverlayClick
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Item Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectItemForm
              itemsObject={itemsObject}
              onClose={stopEditing}
              handleFormSubmit={updateItem}
              item={itemToEdit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

EditSale.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
};
