import { useMemo, useEffect } from 'react';
import { Button, Grid, GridItem } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { connect } from 'react-redux';

import { GET_TAXES } from 'store/actions/taxesActions';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import { getDirtyFields } from 'utils/functions';
import { useToasts } from 'hooks';

import Details from './Details';
import General from './General';
import SaleDetails from './SaleDetails';

function ItemForm(props) {
  const {
    handleFormSubmit,
    item,
    getTaxes,
    loading,
    accounts,
    taxes,
    updating,
    action,
  } = props;
  // console.log({ accounts });
  console.log({ props });
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

  const incomeAccounts = useMemo(() => {
    return accounts?.filter(({ accountType: { id } }) => id === 'income');
  }, [accounts]);

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

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
    salesAccount = incomeAccounts.find(
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

  return loading && action === GET_TAXES ? (
    <SkeletonLoader />
  ) : incomeAccounts?.length > 0 ? (
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
          <General loading={updating} accounts={incomeAccounts} />
        </GridItem>
        <GridItem colSpan={[12, null, 4]}>
          <Grid w="full" gap={6} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={12}>
              <Details loading={updating} />
            </GridItem>
            <GridItem colSpan={12}>
              <SaleDetails loading={updating} taxes={taxes || []} />
            </GridItem>

            <GridItem colSpan={12} display="flex" justifyContent="flex-end">
              <Button
                size="lg"
                colorScheme="cyan"
                type="submit"
                isLoading={updating}
                w="full"
              >
                save
              </Button>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </FormProvider>
  ) : (
    <Empty message="Accounts Data not found!" />
  );
}

ItemForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
};

function mapStateToProps(state) {
  const { accounts } = state.accountsReducer;
  const { loading, action, taxes } = state.taxesReducer;

  return {
    loading,
    action,
    taxes,
    accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemForm);
