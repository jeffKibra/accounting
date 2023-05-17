import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import { isItemABooking } from 'utils/sales';

import ControlledSelect from 'components/ui/ControlledSelect';
// import RHFPlainNumInput from 'components/ui/RHFPlainNumInput';
import ControlledNumInput from 'components/ui/ControlledNumInput';
import ControlledDatePicker from 'components/ui/ControlledDatePicker';
import { getBookingEndDate } from 'utils/sales';

function CustomLabel({ children }) {
  return (
    <FormLabel fontSize="smaller" mb={0} whiteSpace="nowrap">
      {children}
    </FormLabel>
  );
}

function SaleItemFormFields(props) {
  const {
    itemsObject,
    selectedItemsObject,
    // taxesObject,
    loading,
  } = props;

  const {
    formState: { errors },
    watch,
    getValues,
    control,
    setValue,
  } = useFormContext();
  console.log({ errors });

  const item = watch('item');
  console.log({ item });
  const itemId = item?.itemId || '';

  const quantity = watch('quantity');
  const startDate = watch('startDate');
  const startDateString = startDate
    ? new Date(startDate).toLocaleDateString()
    : '';

  useEffect(() => {
    if (startDateString) {
      const endDate = getBookingEndDate(new Date(startDateString), quantity);
      console.log({ endDate });

      setValue('endDate', endDate);
    }
  }, [startDateString, quantity, setValue]);

  useEffect(() => {
    if (itemId) {
      const selectedItem = getValues('item');
      //update form fields based on item fields
      const itemRate = selectedItem?.sellingPrice || 0;
      setValue('rate', itemRate, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [itemId, getValues, setValue]);

  const itemType = item?.type;
  const itemIsABooking = isItemABooking(itemType);

  // console.log({ itemIsABooking });

  // const errors = errors?.selectedItems && errors?.selectedItems[index];

  return (
    <Grid
      rowGap={2}
      columnGap={2}
      templateColumns="repeat(12, 1fr)"
      flexGrow={1}
    >
      <GridItem colSpan={[12]}>
        <FormControl isRequired isInvalid={!!errors?.item}>
          <CustomLabel htmlFor="item">Item</CustomLabel>

          <Controller
            name="item"
            rules={{
              required: { value: true, message: '* Required!' },
            }}
            control={control}
            render={({ field: { onBlur, onChange, value } }) => {
              function handleChange(itemId) {
                const item = itemsObject[itemId];
                onChange(item);
              }

              return (
                <ControlledSelect
                  onChange={handleChange}
                  value={value?.itemId || ''}
                  onBlur={onBlur}
                  isDisabled={loading}
                  placeholder="---select item---"
                  allowClearSelection={false}
                  options={Object.values(itemsObject)
                    .filter(originalItem => {
                      const { itemId } = originalItem;
                      /**
                       * filter to remove selected items-valid items include:
                       * 1. if there is and itemToEdit and current item is similar to itemToEdit
                       * 2. field is not in the selected items object
                       */
                      const itemInSelectedItems = selectedItemsObject[itemId];
                      if (item?.itemId === itemId || !itemInSelectedItems) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((originalItem, i) => {
                      const { name, itemId } = originalItem;

                      return {
                        name,
                        value: itemId,
                      };
                    })}
                />
              );
            }}
          />

          <FormErrorMessage>{errors?.item?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      {/* <GridItem colSpan={[6, null, 3]}>
              <FormControl isInvalid={errors?.salesTax}>
                <CustomLabel htmlFor="salesTax">Item Tax</CustomLabel>
                <ControlledSelect
                  id={`${field.id}-salesTax`}
                  onChange={taxId => updateItemFields('salesTax', taxId, index)}
                  placeholder="Item Tax"
                  options={Object.values(taxesObject).map(tax => {
                    const { taxId, name, rate } = tax;

                    return {
                      name: `${name} (${rate}%)`,
                      value: taxId,
                    };
                  })}
                  value={salesTax?.taxId || ''}
                  isDisabled={!item?.itemId || loading}
                />

                <FormErrorMessage>
                  {errors?.salesTax?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem> */}

      <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.rate}>
          <CustomLabel htmlFor="rate">Rate</CustomLabel>
          {/* <TableNumInput onBlur={() => } /> */}
          <Controller
            name="rate"
            rules={{
              required: { value: true, message: '* Required!' },
            }}
            control={control}
            render={({ field: { value, ref, onBlur, onChange } }) => {
              return (
                <ControlledNumInput
                  ref={ref}
                  updateFieldMode="onBlur"
                  value={value}
                  mode="onBlur"
                  onChange={onChange}
                  onBlur={onBlur}
                  min={1}
                  isReadOnly={loading}
                />
              );
            }}
          />
          {/* <RHFPlainNumInput
                  
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('rate', value, index)}
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                  min={1}
                  isReadOnly={loading}
                  isDisabled={!item?.itemId}
                /> */}

          <FormErrorMessage>{errors?.rate?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      {itemIsABooking ? (
        <>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors?.startDate}
            >
              <CustomLabel htmlFor="startDate">Start Date</CustomLabel>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: { value: true, message: '* Required!' },
                }}
                render={({ field: { name, onBlur, ref, value, onChange } }) => {
                  return (
                    <ControlledDatePicker
                      isReadOnly={loading}
                      size="md"
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      value={value ? new Date(value) : new Date()}
                      onChange={onChange}
                    />
                  );
                }}
              />

              <FormErrorMessage>{errors?.startDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </>
      ) : null}

      <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.quantity}>
          <CustomLabel htmlFor="quantity">
            {itemIsABooking ? 'Days' : 'Quantity'}
          </CustomLabel>
          <Controller
            name="quantity"
            control={control}
            render={({ field: { ref, value, onBlur, onChange } }) => {
              // function handleBlur(blurData) {
              //   console.log({ blurData });
              //   onBlur(blurData);
              // }

              // function handleChange(value) {
              //   console.log({ value });
              //   updateItemFields('quantity', value, index);
              // }

              return (
                <ControlledNumInput
                  ref={ref}
                  updateFieldMode="onBlur"
                  value={value}
                  mode="onBlur"
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  onChange={onChange}
                  onBlur={onBlur}
                  min={1}
                  isReadOnly={loading}
                />
              );
            }}
            rules={{
              required: { value: true, message: '*Required' },
              min: {
                value: 1,
                message: 'Value should be greater than zero(0)!',
              },
            }}
          />
          {/* <RHFPlainNumInput
                  name={`selectedItems.${index}.quantity`}
                  mode="onBlur"
                  updateValueOnBlur={false}
                  onBlur={value => updateItemFields('quantity', value, index)}
                  min={1}
                  isReadOnly={loading}
                  isDisabled={!item?.itemId}
                  rules={{
                    required: { value: true, message: '*Required' },
                    min: {
                      value: 1,
                      message: 'Value should be greater than zero(0)!',
                    },
                  }}
                /> */}

          {/* {itemIsABooking ? (
                  <FormHelperText fontSize="12px" whiteSpace="nowrap">
                    To:{' '}
                    {endDate
                      ? new Date(endDate).toDateString()
                      : new Date().toDateString()}
                  </FormHelperText>
                ) : null} */}

          <FormErrorMessage>{errors?.quantity?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      {itemIsABooking ? (
        <Controller
          name="endDate"
          control={control}
          render={({ field: { value: endDate } }) => (
            <GridItem colSpan={12}>
              <FormLabel textAlign="right" fontSize="smaller" mb={0} mr={3}>
                {startDate
                  ? `${new Date(startDate).toDateString()} - ${
                      endDate ? new Date(endDate).toDateString() : ''
                    }`
                  : ''}
              </FormLabel>
            </GridItem>
          )}
        />
      ) : null}

      <GridItem>
        {/* <FormErrorMessage mt="0px!important">
          Please enter valid item details or delete the line to continue
        </FormErrorMessage> */}
      </GridItem>
    </Grid>
  );
}

SaleItemFormFields.propTypes = {
  itemsObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  updateItemFields: PropTypes.func.isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  taxesObject: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SaleItemFormFields;
