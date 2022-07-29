import { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";

import CustomSelect from "components/ui/CustomSelect";

import SelectItemForm from "components/forms/Sales/SelectItemForm";

import SaleItemsForm from "components/forms/Sales/SaleItemsForm";
import SaleItemsTable from "components/tables/Sales/SaleItemsTable";

import { getSaleSummary, getSalesItemData } from "utils/sales";

export default function EditSale(props) {
  const { loading } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
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

  /**
   * selected items is a map-convert to array for use in table and summary
   * use watch to get updates
   */
  const formItems = watch("selectedItems") || {};
  const selectedItems = Object.values(formItems).filter((item) => item);
  //compute summary values whenever selected items change
  const summary = useMemo(() => {
    return getSaleSummary(selectedItems);
  }, [selectedItems]);

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
    //close editor
    onClose();
    //set item to edit to be null
    setItemToEdit({
      index: null,
      item: null,
    });
  }

  function updateItem(editItem) {
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
    setValue(`selectedItems.${itemId}`, { ...itemData });

    //stop editing-last activity-function closes the editor
    stopEditing();
  }

  function removeItem(itemId) {
    unregister(`selectedItems.${itemId}`);
    //unmark item
    unmarkItemAsAdded(itemId);
  }

  const taxType = watch("taxType");

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
            name="taxType"
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
        taxType={taxType}
      />

      <SaleItemsForm
        loading={loading}
        selectedItems={selectedItems}
        summary={summary}
        taxType={taxType}
      />

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
