import { Button, Grid, GridItem, Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

import { getDirtyFields } from 'utils/functions';
import { useToasts } from 'hooks';

import Details from './Details';
import General from './General';
import SaleDetails from './SaleDetails';

export default function ItemForm(props) {
  // console.log({ props });

  const { handleFormSubmit, item, taxes, accounts, updating } = props;
  // console.log({ accounts });
  const toasts = useToasts();

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: item?.name || '',
      type: item?.type || '',
      // variant: item?.variant || '',
      sku: item?.sku || '',
      //   skuOption: item?.skuOption || 'barcode',
      unit: item?.unit || '',
      costPrice: item?.costPrice || 0,
      sellingPrice: item?.sellingPrice || 0,
      salesAccount: item?.salesAccount?.accountId || 'sales',
      salesTax: item?.salesTax?.taxId || '',
      pricesIncludeTax: item?.pricesIncludeTax || false,
      description: item?.description || '',
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  function onSubmit(data) {
    console.log({ data });
    const {
      salesTax: salesTaxId,
      salesAccount: salesAccountId,
      ...rest
    } = data;
    let formData = {
      ...rest,
    };
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

    if (item) {
      //the item is being updated. Only submit changed form values
      formData = getDirtyFields(dirtyFields, formData);
    }

    // console.log({ formData });
    handleFormSubmit(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <Grid
        w="full"
        gap={6}
        templateColumns="repeat(12, 1fr)"
        as="form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <GridItem colSpan={[12, null, 8]}>
          <General loading={updating} accounts={accounts} />
        </GridItem>
        <GridItem colSpan={[12, null, 4]}>
          <Stack spacing={6}>
            <Details loading={updating} />

            <SaleDetails loading={updating} taxes={taxes || []} />

            <Button
              size="lg"
              colorScheme="cyan"
              type="submit"
              isLoading={updating}
              w="full"
            >
              save
            </Button>
          </Stack>
        </GridItem>
      </Grid>
    </FormProvider>
  );
}

ItemForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
};
