import {
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  // FormHelperText,
  // Switch,
  Textarea,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
//
import { createSKU } from 'functions';

import { useToasts } from 'hooks';

import NumInput from '../../ui/NumInput';
// import CustomSelect from '../../ui/CustomSelect';

export default function ItemForm(props) {
  // console.log({ props });

  const { handleFormSubmit, item, taxes, accounts, updating } = props;
  // console.log({ accounts });
  const toasts = useToasts();

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: item?.name || '',
      // type: item?.type || '',
      //   skuOption: item?.skuOption || 'barcode',
      rate: item?.rate || 0,
      // salesAccount: item?.salesAccount?.accountId || 'sales',
      // salesTax: item?.salesTax?.taxId || '',
      // pricesIncludeTax: item?.pricesIncludeTax || false,
      description: item?.description || '',
    },
  });

  const {
    handleSubmit,
    formState: {
      //  dirtyFields,
      errors,
    },
    register,
  } = formMethods;

  function onSubmit(data) {
    // console.log({ data });
    const {
      salesTax: salesTaxId,
      // salesAccount: formSalesAccountId,
      ...rest
    } = data;
    let formData = {
      ...rest,
      unit: 'days',
      sku: createSKU(data.name),
      type: 'vehicle',
    };

    const salesAccountId = 'vehicle_bookings';
    // console.log({ salesAccountId });
    /**
     * if item is vehicle- assign account='', sku=generate, unit='days'
     */
    //sales account
    let salesAccount = null;
    salesAccount = accounts.find(
      account => account.accountId === salesAccountId
    );
    if (!salesAccount) {
      return toasts.error('The Selected Sales Account is not valid!');
    }
    const { accountId, accountType, name } = salesAccount;
    //add value to newValues
    formData.salesAccount = { accountId, accountType, name };

    //tax account
    let salesTax = null;
    if (salesTaxId) {
      salesTax = taxes.find(tax => tax.taxId === salesTaxId);
      if (!salesTax) {
        return toasts.error('The Selected Tax account is not valid!');
      }
      const { name, rate, taxId } = salesTax;
      //add tax to formData
      formData.salesTax = { name, rate, taxId };
    }

    // if (item) {
    //   //the item is being updated. Only submit changed form values
    //   formData = getDirtyFields(dirtyFields, formData);
    // }

    // console.log(formData);

    // console.log({ formData });
    handleFormSubmit(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <Grid
        borderRadius="md"
        shadow="xl"
        border="1px solid #f2f2f2"
        p={6}
        rowGap={6}
        columnGap={6}
        templateColumns="repeat(12, 1fr)"
        w="full"
        as="form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isReadOnly={updating}
            w="full"
            isRequired
            isInvalid={errors.name}
          >
            <FormLabel htmlFor="name">Registration</FormLabel>
            <Input
              id="name"
              {...register('name', {
                required: { value: true, message: 'Required' },
              })}
            />

            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.rate}>
            <FormLabel htmlFor="rate">Rate per Day (ksh)</FormLabel>
            <NumInput
              name="rate"
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

            <FormErrorMessage>{errors?.rate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={updating} isInvalid={errors.salesTax}>
            <FormLabel htmlFor="salesTax">Tax</FormLabel>
            <CustomSelect
              name="salesTax"
              placeholder="sales tax"
              isDisabled={updating}
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
        </GridItem> */}

        {/* <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={updating}
            w="full"
            // isRequired={salesTax}
            isInvalid={errors.pricesIncludeTax}
          >
            <FormLabel htmlFor="pricesIncludeTax">
              Prices Include Tax?
            </FormLabel>
            <Switch
              {...register('pricesIncludeTax')}
              id="pricesIncludeTax"
              isDisabled={updating}
            />

            <FormErrorMessage>
              {errors?.pricesIncludeTax?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem> */}

        {/* <GridItem colSpan={12}>
        <FormControl
          isDisabled={updating}
          isRequired
          isInvalid={errors.salesAccount}
          display={itemIsVehicle ? 'none' : 'block'}
        >
          <FormLabel htmlFor="salesAccount">Account</FormLabel>
          <CustomSelect
            name="salesAccount"
            placeholder="sales account"
            isDisabled={updating}
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
          <FormControl isDisabled={updating} isInvalid={errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea id="description" {...register('description')} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12} display="flex" justifyContent="flex-end">
          <Button
            size="lg"
            colorScheme="cyan"
            type="submit"
            isLoading={updating}
          >
            save
          </Button>
        </GridItem>
      </Grid>
    </FormProvider>
  );
}

ItemForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
  taxes: PropTypes.array,
  accounts: PropTypes.array.isRequired,
};
