import { useSaleReceiptFormProps } from 'hooks';
//
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import SalesReceiptForm from 'components/forms/SaleReceipt/SaleReceiptForm';

//-
import { EditSaleReceiptPropTypes } from 'propTypes';

EditSaleReceipt.propTypes = {
  ...EditSaleReceiptPropTypes,
};

export default function EditSaleReceipt(props) {
  console.log({ props });
  const { updating, handleFormSubmit, salesReceipt } = props;

  const { accounts, paymentModes, customers, items, taxes, loading } =
    useSaleReceiptFormProps();

  const paymentModesIsEmpty = !paymentModes || paymentModes?.length === 0;
  const accountsIsEmpty = !accounts || accounts?.length === 0;
  const customersIsEmpty = !customers || customers?.length === 0;
  const itemsIsEmpty = !items || items?.length === 0;

  const allAreEmpty =
    itemsIsEmpty || customersIsEmpty || accountsIsEmpty || paymentModesIsEmpty;

  return loading ? (
    <SkeletonLoader />
  ) : allAreEmpty ? (
    <Empty
      message={`${
        itemsIsEmpty
          ? 'Items'
          : customersIsEmpty
          ? 'Customers'
          : accountsIsEmpty
          ? 'Accounts'
          : 'PaymentModes'
      } data not found! Try Reloading the page.`}
    />
  ) : (
    <SalesReceiptForm
      accounts={accounts}
      items={items}
      paymentModes={paymentModes}
      customers={customers}
      taxes={taxes}
      updating={updating}
      salesReceipt={salesReceipt}
      handleFormSubmit={handleFormSubmit}
    />
  );
}
