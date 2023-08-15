import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { RiRefreshLine } from 'react-icons/ri';
//
// import RHFPlainNumInput from 'components/ui/RHFPlainNumInput';
import ControlledNumInput from 'components/ui/ControlledNumInput';
// import ControlledRangeSlider from 'components/ui/ControlledRangeSlider';
// import ControlledDatePicker from 'components/ui/ControlledDatePicker';
//
//
//

function ItemPricingFields(props) {
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
    watch,
  } = useFormContext();
  // console.log({ errors });

  const item = watch('item');

  // console.log({ itemIsABooking });

  // const errors = errors?.selectedItems && errors?.selectedItems[index];

  return (
    <Grid
      rowGap={2}
      columnGap={2}
      templateColumns="repeat(12, 1fr)"
      flexGrow={1}
    >
      <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.bookingRate}>
          <FormLabel htmlFor="bookingRate">Rate</FormLabel>
          <Controller
            name="bookingRate"
            rules={{
              required: { value: true, message: '* Required!' },
            }}
            control={control}
            render={({ field: { value, ref, onBlur, onChange } }) => {
              function handleReset() {
                onChange(item?.rate);
              }

              return (
                <Flex>
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
                  <IconButton
                    onClick={handleReset}
                    title="Reset Car Rate"
                    icon={<RiRefreshLine />}
                  />
                </Flex>
              );
            }}
          />

          <FormErrorMessage>{errors?.bookingRate?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        <FormControl isInvalid={errors?.transferAmount}>
          <FormLabel htmlFor="transferAmount">Transfer Amount</FormLabel>
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

          <FormErrorMessage>{errors?.transferAmount?.message}</FormErrorMessage>
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
    </Grid>
  );
}

ItemPricingFields.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default ItemPricingFields;
