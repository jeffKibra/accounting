import { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Flex, Text, VStack, Button, Heading } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//contexts
//hooks
import { useToasts } from 'hooks';
//utils
import { getSalesItemData } from 'utils/sales';

//ui components
import CustomSelect from 'components/ui/CustomSelect';
//forms
import LineFields from './LineFields';

//-----------------------------------------------------------------------------\
NormalLineItems.propTypes = {
  loading: PropTypes.bool.isRequired,
  itemsObject: PropTypes.object.isRequired,
  taxesObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  // preSelectedItems: PropTypes.array,
};

export default function NormalLineItems(props) {
  console.log({ props });
  const { loading, taxesObject, itemsObject, selectedItemsObject } = props;

  //form methhods
  const {
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
      console.log('updating itemFields', { fieldName, value, index });
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
      console.log({ updatedValues });
      //update item
      setValue(fieldId, updatedValues);
    },
    [setValue, getValues, itemsObject, taxesObject]
  );

  const handleItemChange = useCallback(
    (itemId, index) => {
      console.log('item changed', { itemId, index });
      const selectedItem = itemsObject[itemId];
      const { sellingPrice, salesTax } = selectedItem;

      const itemData = getSalesItemData(
        { itemId, quantity: 1, rate: sellingPrice, salesTax },
        itemsObject[itemId]
      );

      console.log({ itemData });

      //update item at index
      setValue(`selectedItems.${index}`, { ...itemData });
    },
    [setValue, itemsObject]
  );

  // console.log({ errors });

  return (
    <VStack mt={1}>
      <Flex w="full" justify="flex-end" align="center" flexWrap="wrap">
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
          <LineFields
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
    </VStack>
  );
}
