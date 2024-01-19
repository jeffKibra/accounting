import PropTypes from 'prop-types';
//
// import { createSKU } from 'functions';
//
import { useToasts } from 'hooks';
//

//
import Form from './Form';

export default function ItemForm(props) {
  // console.log({ props });

  const { onSubmit, item, taxes, updating } = props;
  // console.log({ item });
  // console.log({ accounts });
  const toasts = useToasts();

  // console.log({ carModels, loadingModels, error });

  function handleSubmit(data) {
    // delete data.model.years;
    // console.log({ data });
    const {
      salesTax: salesTaxId,
      // salesAccount: formSalesAccountId,
      ...rest
    } = data;
    let formData = {
      ...rest,
      // unit: 'days',
      // sku: createSKU(data.name),
      // type: 'vehicle',
    };

    // const salesAccountId = 'vehicle_bookings';
    // // console.log({ salesAccountId });
    // /**
    //  * if item is vehicle- assign account='', sku=generate, unit='days'
    //  */
    // //sales account
    // let salesAccount = null;
    // salesAccount = accounts.find(
    //   account => account.accountId === salesAccountId
    // );
    // if (!salesAccount) {
    //   return toasts.error('The Selected Sales Account is not valid!');
    // }
    // const { accountId, accountType, name } = salesAccount;
    // //add value to newValues
    // formData.salesAccount = { accountId, accountType, name };

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
    onSubmit(formData);
  }

  return (
    <Form
      // accounts={accounts}
      onSubmit={handleSubmit}
      updating={updating}
      vehicle={item || {}}
    />
  );
}

ItemForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  item: PropTypes.object,
  taxes: PropTypes.array,
  accounts: PropTypes.array,
};
