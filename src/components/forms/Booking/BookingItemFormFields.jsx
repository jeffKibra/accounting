import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
  Text,
  Heading,
  IconButton,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { RiEditLine } from 'react-icons/ri';
//
import ControlledSelect from 'components/ui/ControlledSelect';
// import RHFPlainNumInput from 'components/ui/RHFPlainNumInput';
import ControlledNumInput from 'components/ui/ControlledNumInput';
// import ControlledRangeSlider from 'components/ui/ControlledRangeSlider';
// import ControlledDatePicker from 'components/ui/ControlledDatePicker';
//
import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';
//
import Editable from './Components/Editable';
//
import {
  SelectedDatesDisplay,
  NumberDisplay,
} from './Components/CustomDisplays';
import EditBookingPricing from './Components/EditBookingPricing';

function BookingItemFormFields(props) {
  const {
    // taxesObject,
    loading,
    // transactionId,
  } = props;
  // console.log({ itemsObject });

  // const [dateIntervalsToExclude, setDateIntervalsToExclude] = useState([]);

  const {
    formState: { errors },
    control,
    setValue,
    watch,
  } = useFormContext();
  // console.log({ errors });

  const item = watch('item');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const bookingRate = watch('bookingRate');
  const transferAmount = watch('transferAmount');
  const selectedDates = watch('selectedDates');
  const bookingTotal = watch('bookingTotal');

  // useEffect(() => {
  //   if (itemId) {
  //     const selectedItem = getValues('item');
  //     //update form fields based on item fields
  //     const itemRate = selectedItem?.sellingPrice || 0;
  // setValue('rate', itemRate, {
  //   shouldValidate: true,
  //   shouldDirty: true,
  // });
  //   }
  // }, [itemId, getValues, setValue]);

  // console.log({ itemIsABooking });

  // const errors = errors?.selectedItems && errors?.selectedItems[index];

  const carModel = item?.model || {};

  return (
    <>
      <Grid
        rowGap={2}
        columnGap={2}
        templateColumns="repeat(12, 1fr)"
        flexGrow={1}
        // mx={-4}
        // my={4}
        // p={4}
        // bg="#f4f6f8"
      >
        <GridItem colSpan={12}>
          <Editable>
            <Heading mt={-4} textTransform="uppercase">
              {item?.name || ''}
            </Heading>
            <Text>{`${carModel?.make} ${carModel?.model} (${item?.year})`}</Text>
          </Editable>
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={-4}>
          <SelectedDatesDisplay startDate={startDate} endDate={endDate} />
        </GridItem>

        <GridItem colSpan={[12, 6]} mt={-4}>
          <EditBookingPricing>
            {onOpen => {
              return (
                <Editable onButtonClick={onOpen}>
                  <NumberDisplay
                    title="Rate Per Day"
                    value={Number(bookingRate).toLocaleString()}
                  />
                  <NumberDisplay
                    title="Days Count"
                    value={selectedDates?.length || 0}
                  />
                  <NumberDisplay
                    title="Booking Total"
                    value={Number(bookingTotal || 0).toLocaleString()}
                  />
                  <NumberDisplay
                    title="Transfer Amount"
                    value={Number(transferAmount).toLocaleString()}
                  />
                </Editable>
              );
            }}
          </EditBookingPricing>
        </GridItem>

        {/* <GridItem colSpan={12}>
          <FormControl isRequired isInvalid={!!errors?.item}>
            <FormLabel htmlFor="priceRangeFilter">Price Range</FormLabel>
            <Controller
              name="priceRangeFilter"
              id="priceRangeFilter"
              render={({ field: { onBlur, onChange, value } }) => {
                return (
                  <ControlledRangeSlider
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                );
              }}
            />
            <FormErrorMessage>
              {errors?.priceRangeFilter?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem> */}

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
