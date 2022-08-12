import { useMemo, useCallback, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//contexts
//hooks
import { useToasts } from 'hooks';
//utils
import { getSalesItemData, getSaleSummary } from 'utils/sales';

//ui components
import CustomSelect from 'components/ui/CustomSelect';
//forms
import SelectItemForm from 'components/forms/Sales/SelectItemForm';
//tables
import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';

export default function EditSale(props) {
  const { loading, taxes } = props;
  //taxes object
  const taxesObject = useMemo(() => {
    return taxes.reduce((obj, tax) => {
      const { name, rate, taxId } = tax;
      return {
        ...obj,
        [taxId]: { name, rate, taxId },
      };
    }, {});
  }, [taxes]);
  //form methhods
  const {
    watch,
    setValue,
    getValues,
    control,
    // formState: { errors },
  } = useFormContext();
  //hooks
  const toasts = useToasts();
  //state
  /**
   * initialize field array for selected items
   */
  const { fields, remove, append } = useFieldArray({
    name: 'selectedItems',
    control,
    // shouldUnregister: true,
  });
  // console.log({
  //   fields,
  //   slItems: watch('selectedItems'),
  //   customer: watch('customer'),
  // });

  useEffect(() => {
    console.log('mounting');

    return () => console.log('unmounting');
  }, []);

  // useEffect(() => {
  //   /**
  //    * add default selectedItems
  //    */
  //   console.log('updating default selectedItems');
  //   if (
  //     preSelectedItems &&
  //     Array.isArray(preSelectedItems) &&
  //     preSelectedItems.length > 0
  //   ) {
  //     // replace(preSelectedItems);
  //     // preSelectedItems.forEach(item => {
  //     //   append({ ...item });
  //     // });
  //   } else {
  //     // append({
  //     //   item: null,
  //     //   rate: 0,
  //     //   quantity: 0,
  //     //   itemRate: 0,
  //     //   itemTax: 0,
  //     //   itemRateTotal: 0,
  //     //   itemTaxTotal: 0,
  //     //   salesTax: null,
  //     // });
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const itemsFields = watch('selectedItems');

  /**
   * using watch makes selecetd items(fields) to change on every render.
   * to avoid performance issues, convert formItems into a JSON string
   * useMemo and useEffect with be able to compare strings appropriately
   * and only rerender when value changes
   */
  const fieldsString = JSON.stringify(itemsFields || []);
  //compute summary values whenever selected items change
  const { summary, selectedItemsObject } = useMemo(() => {
    /**
     * parse the json string to get back field values
     */
    const selectedItems = JSON.parse(fieldsString);

    const selectedItemsObject = selectedItems.reduce((summary, itemDetails) => {
      const { item } = itemDetails;
      if (item) {
        return {
          ...summary,
          [item.itemId]: itemDetails,
        };
      } else {
        return summary;
      }
    }, {});

    console.log('generating summary');
    const summary = getSaleSummary(selectedItems);

    return { selectedItemsObject, summary };
  }, [fieldsString]);
  /**
   * convert items into an object for easier updates .
   * helps to avoid iterating the whole array for every update
   */
  const itemsObject = useMemo(() => {
    const items = props.items;
    let itemsObject = {};

    if (items && Array.isArray(items)) {
      itemsObject = items.reduce((obj, item) => {
        const { itemId } = item;
        return {
          ...obj,
          [itemId]: { ...item },
        };
      }, {});
    }

    return itemsObject;
  }, [props.items]);

  const addNewLine = useCallback(() => {
    console.log('adding new line');
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
    index => {
      //fetch item from list using the index
      const item = getValues(`selectedItems.${index}`);
      // console.log({ item, index });

      if (item && typeof item === 'object') {
        //remove it from form
        remove(index);
      } else {
        //item is undefined
        toasts.error(`Item at Index ${index} not found`);
      }
    },
    [remove, getValues, toasts]
  );

  const updateItemFields = useCallback(
    (fieldName, value, index) => {
      const fieldId = `selectedItems.${index}`;
      const currentValues = getValues(fieldId);
      const {
        item: { itemId },
        quantity,
        rate,
        salesTax,
      } = currentValues;

      const originalItem = itemsObject[itemId];
      let selectedItemData = {
        itemId,
        quantity,
        rate,
        salesTax,
      };

      /**
       * field name is either quantity or rate or salesTax.
       * add at bottom to overide current value
       */
      selectedItemData = {
        ...selectedItemData,
        [fieldName]: fieldName === 'salesTax' ? taxesObject[value] : +value,
      };

      const updatedValues = getSalesItemData(selectedItemData, originalItem);
      //update item
      setValue(fieldId, updatedValues);
    },
    [setValue, getValues, itemsObject, taxesObject]
  );

  const handleItemChange = useCallback(
    (itemId, index) => {
      const selectedItem = itemsObject[itemId];
      const { sellingPrice, salesTax } = selectedItem;

      const itemData = getSalesItemData(
        { itemId, quantity: 1, rate: sellingPrice, salesTax },
        itemsObject[itemId]
      );

      //update item at index
      setValue(`selectedItems.${index}`, { ...itemData });
    },
    [setValue, itemsObject]
  );

  // console.log({ errors });

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
              { name: 'Inclusive of Tax', value: 'taxInclusive' },
              { name: 'Exclusive of Tax', value: 'taxExclusive' },
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
            selectedItemsObject={selectedItemsObject}
            removeItem={removeItem}
            handleItemChange={handleItemChange}
            updateItemFields={updateItemFields}
            field={field}
            taxesObject={taxesObject}
            loading={loading}
          />
        );
      })}
      <Flex w="full" justifyContent="flex-start">
        <Button
          onClick={addNewLine}
          size="sm"
          colorScheme="cyan"
          leftIcon={<RiAddLine />}
          disabled={loading}
        >
          add item
        </Button>
      </Flex>
      );
      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]}>
          <SaleSummaryTable loading={loading} summary={summary} />
        </GridItem>
      </Grid>
    </VStack>
  );
}

EditSale.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  taxes: PropTypes.array.isRequired,
  // preSelectedItems: PropTypes.array,
};
