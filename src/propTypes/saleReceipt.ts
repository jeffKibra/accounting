import PropTypes from 'prop-types';

export const EditSaleReceiptPropTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  saleReceipt: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    selectedItems: PropTypes.array,
    customerId: PropTypes.string,
    receiptDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    receiptSlug: PropTypes.string,
    receiptId: PropTypes.string,
  }),
};

export const SaleReceiptFormPropTypes = {
  ...EditSaleReceiptPropTypes,
  paymentModes: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  customers: PropTypes.array,
  items: PropTypes.array.isRequired,
  taxes: PropTypes.array,
};
