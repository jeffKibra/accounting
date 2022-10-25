import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  FormHelperText,
  Switch,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import NumInput from '../../ui/NumInput';
import CustomSelect from '../../ui/CustomSelect';

function SaleDetails(props) {
  const { loading, taxes } = props;

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const salesTax = watch('salesTax');

  return (
    <Grid
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #f2f2f2"
      p={6}
      columnGap={4}
      rowGap={2}
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem colSpan={12}>
        <FormControl isReadOnly={loading} isInvalid={errors.costPrice}>
          <FormLabel htmlFor="costPrice">Cost Price (ksh)</FormLabel>
          <NumInput
            name="costPrice"
            min={0}
            size="md"
            rules={{
              min: {
                value: 0,
                message: 'Value should not be less than zero(0)!',
              },
            }}
          />

          <FormErrorMessage>{errors?.costPrice?.message}</FormErrorMessage>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.sellingPrice}
        >
          <FormLabel htmlFor="sellingPrice">Selling Price (ksh)</FormLabel>
          <NumInput
            name="sellingPrice"
            min={0}
            rules={{
              required: { value: true, message: '*Required!' },
              min: {
                value: 1,
                message: 'Value should be greater than zero(0)!',
              },
            }}
          />

          <FormErrorMessage>{errors?.sellingPrice?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isDisabled={loading} isInvalid={errors.salesTax}>
          <FormLabel htmlFor="salesTax">Tax</FormLabel>
          <CustomSelect
            name="salesTax"
            placeholder="sales tax"
            isDisabled={loading}
            options={taxes.map((tax, i) => {
              const { name, rate, taxId } = tax;

              return {
                name: `${name} - ${rate}%`,
                value: taxId,
              };
            })}
          />
          <FormErrorMessage>{errors?.salesTax?.message}</FormErrorMessage>
          <FormHelperText>Add tax to your item</FormHelperText>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl
          isDisabled={loading}
          w="full"
          // isRequired={salesTax}
          isInvalid={errors.pricesIncludeTax}
        >
          <FormLabel htmlFor="pricesIncludeTax">Prices Include Tax?</FormLabel>
          <Switch
            {...register('pricesIncludeTax')}
            id="pricesIncludeTax"
            isDisabled={loading}
          />
          {/* <CustomSelect
            name="salesTaxType"
            isDisabled={loading}
            placeholder="Select a tax type"
            options={[
              { name: 'tax inclusive', value: 'tax inclusive' },
              { name: 'tax exclusive', value: 'tax exclusive' },
            ]}
            allowClearSelection
            rules={{
              validate: {
                required: value => {
                  return !salesTax || !!value || '*Required!';
                },
              },
            }}
          /> */}

          <FormErrorMessage>
            {errors?.pricesIncludeTax?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </Grid>
  );
}

SaleDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
};

export default SaleDetails;
