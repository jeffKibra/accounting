import { useEffect, useState, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
  Text,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledSelect from 'components/ui/ControlledSelect';
// import RHFPlainNumInput from 'components/ui/RHFPlainNumInput';
import ControlledNumInput from 'components/ui/ControlledNumInput';
// import ControlledDatePicker from 'components/ui/ControlledDatePicker';
import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';

function BookingItemFormFields(props) {
  const {
    itemsObject,
    // taxesObject,
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
      const { salesTax, rate } = item;
      setValue('bookingRate', rate, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('salesTax', salesTax, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  const itemsArray = useMemo(() => {
    const array = Object.values(itemsObject);
    if (array.length === 0) {
      array.push({
        name: 'There are no available vehicles for the selected date range!',
        value: '',
      });
    }

    return array;
  }, [itemsObject]);

  // console.log({ itemIsABooking });

  // const errors = errors?.selectedItems && errors?.selectedItems[index];

  return (
    <>
      <Controller
        name="quantity"
        control={control}
        render={() => {
          return <></>;
        }}
      />
      <Grid
        rowGap={2}
        columnGap={2}
        templateColumns="repeat(12, 1fr)"
        flexGrow={1}
        mx={-4}
        my={4}
        p={4}
        bg="#f4f6f8"
      >
        <GridItem colSpan={[12]}>
          <FormControl isRequired isInvalid={!!errors?.item}>
            <FormLabel htmlFor="item">Select Vehicle</FormLabel>

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
                    placeholder="---select vehicle---"
                    allowClearSelection={false}
                    options={itemsArray.map(item => {
                      const { name, itemId, rate } = item;

                      return {
                        name: (
                          <Box display="flex">
                            <Text flexGrow={1}>{name}</Text>
                            <Text>KES {rate}</Text>
                          </Box>
                        ),
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
          <FormControl isInvalid={errors?.bookingRate}>
            <FormLabel htmlFor="bookingRate">Rate</FormLabel>
            {/* <TableNumInput onBlur={() => } /> */}
            <Controller
              name="bookingRate"
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

            <FormErrorMessage>{errors?.bookingRate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isInvalid={errors?.transferAmount}>
            <FormLabel htmlFor="transferAmount">Transfer Amount</FormLabel>
            {/* <TableNumInput onBlur={() => } /> */}
            <Controller
              name="transferAmount"
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

            <FormErrorMessage>
              {errors?.transferAmount?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.salesTax}>
          <FormLabel htmlFor="salesTax">Item Tax</FormLabel>
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
      </GridItem> */}

        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]} mr={-5}>
          <SaleSummaryTable loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}

BookingItemFormFields.propTypes = {
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

export default BookingItemFormFields;
