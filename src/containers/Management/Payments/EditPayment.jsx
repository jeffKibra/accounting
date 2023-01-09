import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { GET_ITEMS } from '../../../store/actions/itemsActions';
import { GET_CUSTOMERS } from '../../../store/actions/customersActions';
import { GET_PAYMENT_MODES } from '../../../store/actions/paymentModesActions';
import {
  GET_UNPAID_CUSTOMER_INVOICES,
  GET_PAYMENT_INVOICES_TO_EDIT,
} from '../../../store/actions/invoicesActions';

import Empty from '../../../components/ui/Empty';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import PaymentForm from 'components/forms/Payment';

function EditPayment(props) {
  const {
    loading,
    action,
    customers,
    getCustomers,
    getPaymentModes,
    loadingPaymentModes,
    paymentModes,
  } = props;

  useEffect(() => {
    getCustomers();
    getPaymentModes();
  }, [getCustomers, getPaymentModes]);

  return (loading && action === GET_CUSTOMERS) || loadingPaymentModes ? (
    <SkeletonLoader />
  ) : customers?.length > 0 || paymentModes?.length > 0 ? (
    <PaymentForm {...props} />
  ) : customers?.length === 0 ? (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  ) : paymentModes?.length === 0 ? (
    <Empty message="Failed to load Payment Modes. This could be because of a network issue. Try reloading the page!" />
  ) : null;
}

EditPayment.propTypes = {
  saveData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentModeId: PropTypes.string,
    accountId: PropTypes.string,
    bankCharges: PropTypes.number,
    amount: PropTypes.number,
    customerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentDate: PropTypes.instanceOf(Date),
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, customers, action } = state.customersReducer;
  const { accounts } = state.accountsReducer;
  const { loading: l, action: a, invoices } = state.invoicesReducer;
  const { loading: lpm, action: pma, paymentModes } = state.paymentModesReducer;

  const loadingInvoices =
    l &&
    (a === GET_UNPAID_CUSTOMER_INVOICES || a === GET_PAYMENT_INVOICES_TO_EDIT);
  const loadingPaymentModes = lpm && pma === GET_PAYMENT_MODES;

  return {
    loading,
    action,
    customers,
    accounts,
    loadingInvoices,
    invoices,
    loadingPaymentModes,
    paymentModes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
    getInvoices: customerId =>
      dispatch({ type: GET_UNPAID_CUSTOMER_INVOICES, payload: customerId }),
    getInvoicesToEdit: (customerId, paymentId) =>
      dispatch({
        type: GET_PAYMENT_INVOICES_TO_EDIT,
        payload: { customerId, paymentId },
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
