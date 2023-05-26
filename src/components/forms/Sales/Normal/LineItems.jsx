import { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Flex, Text, VStack, Button, Heading } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//contexts
//hooks
import { useToasts } from 'hooks';
//utils
import {
  getSalesItemData,
  isItemABooking,
  getBookingEndDate,
} from 'utils/sales';

//ui components
import CustomSelect from 'components/ui/CustomSelect';
import SaleItemFormFieldsModal from './SaleItemModalForm';
//forms
import LineFields from './LineFields';

//-----------------------------------------------------------------------------\
LineItems.propTypes = {
  loading: PropTypes.bool.isRequired,
  itemsObject: PropTypes.object.isRequired,
  taxesObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  // preSelectedItems: PropTypes.array,
};

export default function LineItems(props) {
  // console.log({ props });
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
      startDate: new Date(),
      endDate: new Date(),
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
      try {
        console.log('updating itemFields', { fieldName, value, index });
        const fieldId = `selectedItems.${index}`;
        const currentValues = getValues(fieldId);
        // console.log({ currentValues });
        const {
          item: { vehicleId, type },
          quantity,
          rate,
          salesTax,
          startDate,
        } = currentValues;
        console.log({ type });

        const originalItem = itemsObject[vehicleId];
        let selectedItemData = {
          vehicleId,
          quantity,
          rate,
          salesTax,
          startDate: startDate || new Date(),
        };

        /**
         * field name is either quantity or rate or salesTax.
         * add at bottom to overide current value
         */
        selectedItemData = {
          ...selectedItemData,
          [fieldName]: fieldName === 'salesTax' ? taxesObject[value] : value,
        };

        const itemIsABooking = isItemABooking(type);
        console.log({ itemIsABooking });

        if (
          (fieldName === 'quantity' || fieldName === 'startDate') &&
          itemIsABooking
        ) {
          let bookingDays = 0;
          let bookingStartDate = new Date(startDate);

          if (fieldName === 'quantity') {
            bookingDays = value;
            bookingStartDate = startDate;
          } else if (fieldName === 'startDate') {
            bookingDays = quantity;
            bookingStartDate = value;
          }

          const endDate = getBookingEndDate(bookingStartDate, bookingDays);
          console.log({ endDate });

          selectedItemData.endDate = endDate.toISOString();
        }

        const updatedValues = getSalesItemData(selectedItemData, originalItem);

        // console.log({ updatedValues });
        //update item
        setValue(fieldId, updatedValues);
      } catch (error) {
        console.error(error);
        toasts.error(
          `Error update form fields: ${error?.message || 'Unknown Error!'}`
        );
      }
    },
    [setValue, getValues, itemsObject, taxesObject, toasts]
  );

  const handleItemChange = useCallback(
    (vehicleId, index) => {
      console.log('item changed', { vehicleId, index });
      const selectedItem = itemsObject[vehicleId];
      const { sellingPrice, salesTax } = selectedItem;

      const originalItem = itemsObject[vehicleId];
      console.log({ originalItem });

      const initialQuantity = 1;
      const itemData = getSalesItemData(
        { vehicleId, quantity: initialQuantity, rate: sellingPrice, salesTax },
        originalItem
      );
      console.log({ itemData });

      const itemType = originalItem?.type;
      console.log({ itemType });
      const itemIsABooking = isItemABooking(itemType);
      console.log({ itemIsABooking });

      if (itemIsABooking) {
        const startDate = new Date();
        const endDate = getBookingEndDate(startDate, initialQuantity);
        console.log({ endDate });
        //update fields in object
        itemData.startDate = startDate;
        itemData.endDate = endDate;
      }

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
        {/* <Button
          onClick={addNewLine}
          size="sm"
          colorScheme="cyan"
          leftIcon={<RiAddLine />}
          disabled={loading}
        >
          add item
        </Button> */}

        <SaleItemFormFieldsModal
          itemsObject={itemsObject}
          selectedItemsObject={selectedItemsObject}
          removeItem={removeItem}
          handleItemChange={handleItemChange}
          updateItemFields={updateItemFields}
          taxesObject={taxesObject}
          loading={loading}
        >
          {(openModal, triggerRef) => {
            return (
              <Button
                onClick={openModal}
                size="sm"
                colorScheme="cyan"
                leftIcon={<RiAddLine />}
                disabled={loading}
                ref={triggerRef}
              >
                add item
              </Button>
            );
          }}
        </SaleItemFormFieldsModal>
      </Flex>
      );
    </VStack>
  );
}
