import { useMemo, useState, useContext, useEffect, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Grid,
  GridItem,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";
//contexts
import StepperContext from "contexts/StepperContext";
//hooks
import { useToasts } from "hooks";
//utils
import { getSalesItemData, getSaleSummary } from "utils/sales";

//ui components
import CustomSelect from "components/ui/CustomSelect";
//forms
import SelectItemForm from "components/forms/Sales/SelectItemForm";
//tables
import SaleSummaryTable from "components/tables/Sales/SaleSummaryTable";

export default function EditSale(props) {
  const { loading, preSelectedItems } = props;
  //contexts
  const { nextStep } = useContext(StepperContext);
  //form methhods
  const { watch, setValue, getValues, control } = useFormContext();
  //hooks
  const toasts = useToasts();
  //state
  /**
   * initialize field array for selected items
   */
  const { fields, remove, append } = useFieldArray({
    name: "selectedItems",
    control,
    shouldUnregister: true,
  });
  const itemsFields = watch("selectedItems");

  /**
   * using watch makes selecetd items(fields) to change on every render.
   * to avoid performance issues, convert formItems into a JSON string
   * useMemo and useEffect with be able to compare strings appropriately
   * and only rerender when value changes
   */
  const fieldsString = JSON.stringify(itemsFields || []);
  //compute summary values whenever selected items change
  const { summary, selectedItems } = useMemo(() => {
    /**
     * parse the json string to get back field values
     */
    const selectedItems = JSON.parse(fieldsString);

    console.log("generating summary");
    const summary = getSaleSummary(selectedItems);

    return { selectedItems, summary };
  }, [fieldsString]);

  /**
   * convert items into an object for easier updates .
   * helps to avoid iterating the whole array for every update
   */
  const [itemsObject, setItemsObject] = useState({});
  /**
   * set the items object on mount
   * incase its an update-mark all pre-selected items as added
   */
  useEffect(() => {
    console.log("regenerating selectable Items");
    let itemsObject = {};
    const { items } = props;

    console.log({ preSelectedItems });

    if (items && Array.isArray(items)) {
      itemsObject = items.reduce((obj, item) => {
        const { itemId } = item;
        let added = false;

        if (Array.isArray(preSelectedItems)) {
          const preSelectedItem = preSelectedItems.find(
            (preItem) => preItem.itemId === itemId
          );

          if (preSelectedItem) {
            //added is only true if preSelectedItem is found
            added = true;
          }
        }

        return {
          ...obj,
          [itemId]: { ...item, added },
        };
      }, {});
    }

    if (
      preSelectedItems &&
      Array.isArray(preSelectedItems) &&
      preSelectedItems.length > 0
    ) {
      /**
       * append all preSelectedItems to field arrays
       */
      append(preSelectedItems, {});
    }

    //set items object
    setItemsObject(itemsObject);
    //dont add dependency array-code should run only once-onmount
  }, []);

  const markItemAsAdded = useCallback((itemId) => {
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
  }, []);

  const unmarkItemAsAdded = useCallback((itemId) => {
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
  }, []);

  /**
   * function triggers validation for selected items before moving to the next step
   */
  const next = useCallback(() => {
    const selectedItems = getValues("selectedItems");
    console.log({ selectedItems });

    const fieldsValid =
      (selectedItems && selectedItems.filter((item) => item).length > 0) ||
      false;

    if (!fieldsValid) {
      return toasts.error("Please add atleast one(1) item to proceed!");
    }
    // if (totalAmount <= 0) {
    //   return toasts.error("Total Sale Amount should be greater than ZERO(0)!");
    // }

    nextStep();
  }, [getValues, nextStep, toasts]);

  const addNewLine = useCallback(() => {
    console.log("adding new line");
    append({
      item: null,
      rate: 0,
      quantity: 0,
      itemRate: 0,
      itemTax: 0,
      itemRateTotal: 0,
      itemTaxTotal: 0,
      salesTax: null,
    });
  }, [append]);

  // console.log({ fields, errors });

  const removeItem = useCallback(
    (index) => {
      //fetch item from list using the index
      const item = getValues(`selectedItems.${index}`);
      console.log({ item, index });

      if (item && typeof item === "object") {
        //remove it from form
        remove(index);
        //unmark item
        unmarkItemAsAdded(item.itemId);
      } else {
        //item is undefined
        toasts.error(`Item at Index ${index} not found`);
      }
    },
    [remove, getValues, toasts, unmarkItemAsAdded]
  );

  const updateFieldOnBlur = useCallback(
    (index) => {
      //only call onBlur
      const fieldId = `selectedItems.${index}`;
      const currentValues = getValues(fieldId);
      console.log({ currentValues });

      const {
        item: { itemId },
        quantity,
        rate,
      } = currentValues;

      const originalItem = itemsObject[itemId];
      console.log({ originalItem });

      const updatedValues = getSalesItemData(
        {
          itemId,
          quantity,
          rate,
        },
        originalItem
      );
      console.log({ updatedValues });
      //update item
      setValue(fieldId, updatedValues);
    },
    [setValue, getValues, itemsObject]
  );

  const handleItemChange = useCallback(
    (itemId, index, cb) => {
      const selectedItem = itemsObject[itemId];
      const { sellingPrice } = selectedItem;
      console.log({ itemId, selectedItem });

      const itemData = getSalesItemData(
        { itemId, quantity: 1, rate: sellingPrice },
        itemsObject[itemId]
      );
      console.log({ itemData });

      //set form value using a passed callback function
      if (cb && typeof cb === "function") {
        cb(itemData.item);
      }

      //set items rate
      setValue(`selectedItems.${index}`, { ...itemData });
      //mark item as added to list to avoid duplicate values in list
      markItemAsAdded(itemId);
    },
    [setValue, markItemAsAdded, itemsObject]
  );

  return (
    <VStack mt={1}>
      <Flex w="full" justify="flex-end" align="center">
        <Flex grow={1} h="32px" alignItems="center">
          <Heading size="md" as="h3">
            Items
          </Heading>
        </Flex>

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
      {fields.map((field, index) => {
        return (
          <SelectItemForm
            key={field.id}
            index={index}
            itemsObject={itemsObject}
            removeItem={removeItem}
            handleItemChange={handleItemChange}
            updateFieldOnBlur={updateFieldOnBlur}
            field={field}
          />
        );
      })}
      <Flex w="full" justifyContent="flex-start">
        <Button
          onClick={addNewLine}
          size="sm"
          colorScheme="cyan"
          rightIcon={<RiAddLine />}
        >
          new line
        </Button>
      </Flex>
      );
      {/* <SaleItemsTable
        loading={loading}
        handleEdit={startEditing}
        handleDelete={removeItem}
        items={selectedItems}
        taxType={watch("summary.taxType")}
      /> */}
      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[1, 4, 6]}></GridItem>
        <GridItem colSpan={[11, 8, 6]}>
          <SaleSummaryTable
            loading={loading}
            selectedItems={selectedItems}
            summary={summary}
          />
        </GridItem>
      </Grid>
      <Flex w="full" py={4} justify="space-evenly">
        <Button
          onClick={next}
          type="submit"
          isLoading={loading}
          colorScheme="cyan"
        >
          save
        </Button>
      </Flex>
    </VStack>
  );
}

EditSale.defaultProps = {
  preSelectedItems: [],
};

EditSale.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  preSelectedItems: PropTypes.array,
};
