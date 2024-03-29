import { useEffect, useState } from 'react';
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
// import ControlledDatePicker from 'components/ui/ControlledDatePicker';
import DateRangePicker from 'components/ui/DateRangePicker';
import { getDaysDifference } from 'utils/dates';

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
    taxesObject,
    loading,
    transactionId,
  } = props;
  console.log({ itemsObject });

  const [dateIntervalsToExclude, setDateIntervalsToExclude] = useState([]);

  const {
    formState: { errors },
    watch,
    control,
    setValue,
  } = useFormContext();
  console.log({ errors });

  const dateRange = watch('dateRange');
  const item = watch('item');
  console.log({ dateRange, item });

  const itemId = item?.itemId || '';
  const itemType = item?.type;
  const itemIsABooking = isItemABooking(itemType);

  useEffect(() => {
    if (Array.isArray(dateRange)) {
      const [startDate, endDate] = dateRange;

      if (startDate && endDate) {
        const quantity = getDaysDifference(startDate, endDate);
        console.log({ quantity });

        setValue('quantity', quantity);
      }
    }
  }, [dateRange, setValue]);

  useEffect(() => {
    console.log('item has changed', { itemId, transactionId });

    const item = itemsObject[itemId];
    console.log({ item });

    if (item) {
      //update dateIntervalsToExclude based on already booked dates

      const bookings = item?.bookings || {};
      console.log({ bookings });

      Object.keys(bookings).forEach(tId => {
        if (tId !== transactionId) {
          const dateRange = bookings[tId];
          console.log({ dateRange });

          const interval = {
            start: new Date(dateRange[0]),
            end: new Date(dateRange[1]),
          };

          setDateIntervalsToExclude(current => {
            return [...current, interval];
          });
        }
      });
    }
  }, [itemId, transactionId, itemsObject]);

  // useEffect(() => {
  //   if (itemId) {
  //     const selectedItem = getValues('item');
  //     //update form fields based on item fields
  //     const itemRate = selectedItem?.sellingPrice || 0;
  //     setValue('rate', itemRate, {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //     });
  //   }
  // }, [itemId, getValues, setValue]);

  function handleItemChange(item) {
    console.log('item has changed', item);
    if (item) {
      const { salesTax, sellingPrice } = item;
      setValue('rate', sellingPrice, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('salesTax', salesTax, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

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
                handleItemChange(item); //update rate and tax fields
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

      <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.salesTax}>
          <CustomLabel htmlFor="salesTax">Item Tax</CustomLabel>
          <Controller
            name="salesTax"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => {
              function handleChange(taxId) {
                console.log({ taxId });
                const salesTax = taxesObject[taxId];
                onChange(salesTax);
              }

              return (
                <ControlledSelect
                  id={name}
                  onChange={handleChange}
                  onBlur={onBlur}
                  placeholder="Item Tax"
                  options={Object.values(taxesObject).map(tax => {
                    const { taxId, name, rate } = tax;

                    return {
                      name: `${name} (${rate}%)`,
                      value: taxId,
                    };
                  })}
                  value={value?.taxId || ''}
                  isDisabled={loading}
                />
              );
            }}
          />

          <FormErrorMessage>{errors?.salesTax?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      {itemIsABooking ? (
        <>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors?.dateRange}
            >
              <CustomLabel htmlFor="dateRange">Select Dates</CustomLabel>

              <DateRangePicker
                name="dateRange"
                isReadOnly={loading}
                inline
                dateIntervalsToExclude={dateIntervalsToExclude}
              />
              {/* <Controller
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
              /> */}

              <FormErrorMessage>{errors?.dateRange?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </>
      ) : (
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
      )}

      {/* {itemIsABooking ? (
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
      ) : null} */}

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
