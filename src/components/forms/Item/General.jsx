import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Switch,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import NumInput from '../../ui/NumInput';
import CustomSelect from '../../ui/CustomSelect';

function General(props) {
  // console.log({ props });
  const { loading, taxes } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid
      borderRadius="md"
      shadow="xl"
      border="1px solid #f2f2f2"
      p={6}
      rowGap={1}
      columnGap={4}
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem colSpan={12}>
        <FormControl
          isReadOnly={loading}
          w="full"
          isRequired
          isInvalid={errors.registration}
        >
          <FormLabel htmlFor="registration">Registration</FormLabel>
          <Input
            id="registration"
            {...register('registration', {
              required: { value: true, message: 'Required' },
            })}
          />

          <FormErrorMessage>{errors?.registration?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={12}>
        <FormControl isDisabled={loading} isInvalid={errors.ratePerDay}>
          <FormLabel htmlFor="ratePerDay">Rate per Day (ksh)</FormLabel>
          <NumInput
            name="ratePerDay"
            min={0}
            size="md"
            rules={{
              // required: { value: true, message: '*Required!' },
              min: {
                value: 0,
                message: 'Value should be a positive integer!',
              },
            }}
          />

          <FormErrorMessage>{errors?.ratePerDay?.message}</FormErrorMessage>
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

          <FormErrorMessage>
            {errors?.pricesIncludeTax?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>

      {/* <GridItem colSpan={12}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.salesAccount}
          display={itemIsVehicle ? 'none' : 'block'}
        >
          <FormLabel htmlFor="salesAccount">Account</FormLabel>
          <CustomSelect
            name="salesAccount"
            placeholder="sales account"
            isDisabled={loading}
            rules={{ required: { value: true, message: 'Required' } }}
            options={accounts.map((account, i) => {
              const { name, accountId } = account;
              return {
                name,
                value: accountId,
              };
            })}
          />
          <FormErrorMessage>{errors?.salesAccount?.message}</FormErrorMessage>
        </FormControl>
      </GridItem> */}

      <GridItem colSpan={12}>
        <FormControl isDisabled={loading} isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" {...register('description')} />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
    </Grid>
  );
}

General.propTypes = {
  loading: PropTypes.bool.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default General;
