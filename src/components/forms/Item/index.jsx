import PropTypes from 'prop-types';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
//
import { createSKU } from 'functions';
//
import { useToasts, useCarModels } from 'hooks';
//
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import Form from './Form';

export default function ItemForm(props) {
  // console.log({ props });

  const { handleFormSubmit, item, taxes, accounts, updating } = props;
  // console.log({ accounts });
  const toasts = useToasts();

  const { carModels, carMakes, loading: loadingModels, error } = useCarModels();
  // console.log({ carModels, loadingModels, error });

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
    <>
      {loadingModels ? (
        <SkeletonLoader />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error Fetching Car Models!</AlertTitle>
          <AlertDescription>
            {error?.message || 'Unknown error.'}
          </AlertDescription>
        </Alert>
      ) : carMakes && carModels ? (
        <Form
          accounts={accounts}
          handleFormSubmit={onSubmit}
          updating={updating}
          item={item || {}}
          carModels={carModels}
          carMakes={carMakes}
        />
      ) : (
        <Empty message="Car models not found. Try adding some car models before proceeding." />
      )}
    </>
  );
}

ItemForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
  taxes: PropTypes.array,
  accounts: PropTypes.array.isRequired,
};
