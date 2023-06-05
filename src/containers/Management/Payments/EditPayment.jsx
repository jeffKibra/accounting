import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { GET_ITEMS } from '../../../store/actions/itemsActions';
import { GET_CUSTOMERS } from '../../../store/actions/customersActions';
import { GET_PAYMENT_MODES } from '../../../store/actions/paymentModesActions';

import { useAccounts } from 'hooks';

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
    saveData,
  } = props;
  const { accounts, loading: loadingAccounts } = useAccounts();

  const paymentAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) {
      return [];
    }

    return accounts
      .filter(account => {
        const {
          accountType: { id },
          tags,
        } = account;
        const index = tags.findIndex(tag => tag === 'receivable');

        return (
          id === 'cash' || (id === 'other_current_liability' && index > -1)
        );
      })
      .map(account => {
        const { name, accountId, accountType } = account;
        return { name, accountId, accountType };
      });
  }, [accounts]);

  useEffect(() => {
    getCustomers();
    getPaymentModes();
  }, [getCustomers, getPaymentModes]);

  return (loading && action === GET_CUSTOMERS) ||
    loadingPaymentModes ||
    loadingAccounts ? (
    <SkeletonLoader />
  ) : accounts?.length > 0 &&
    customers?.length > 0 &&
    paymentModes?.length > 0 ? (
    <PaymentForm
      {...props}
      handleFormSubmit={saveData}
      accounts={paymentAccounts}
    />
  ) : (
    <Empty
      message={
        !customers || customers?.length === 0
          ? 'Please add atleast one CUSTOMER to continue or reload the page'
          : !accounts || accounts?.length === 0
          ? 'Failed to load Payment Modes. This could be because of a network issue. Try reloading the page!'
          : 'Failed to load Payment Modes. This could be because of a network issue. Try reloading the page!'
      }
    />
  );
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
  const { loading: lpm, action: pma, paymentModes } = state.paymentModesReducer;

  const loadingPaymentModes = lpm && pma === GET_PAYMENT_MODES;

  return {
    loading,
    action,
    customers,
    accounts,
    loadingPaymentModes,
    paymentModes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
