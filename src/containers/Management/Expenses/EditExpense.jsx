import { useEffect, useState, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { GET_PAYMENT_MODES } from '../../../store/actions/paymentModesActions';
import { GET_VENDORS } from '../../../store/actions/vendorsActions';
import { GET_TAXES } from '../../../store/actions/taxesActions';
//
import { useAccounts } from 'hooks';
//
import Stepper from '../../../components/ui/Stepper';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ExpenseForm from '../../../components/forms/Expenses/ExpenseForm';
import ExpenseItemsList from './ExpenseItemsList';

function EditExpense(props) {
  const {
    expense,
    handleFormSubmit,
    updating,
    getPaymentModes,
    loadingPaymentModes,
    paymentModes,
    getVendors,
    loadingVendors,
    vendors,
    getTaxes,
    loadingTaxes,
    taxes,
  } = props;
  const { accounts, loading: loadingAccounts } = useAccounts();
  // console.log({ props });
  const [formValues, setFormValues] = useState(
    expense || { taxType: 'taxInclusive' }
  );
  function updateFormValues(data) {
    setFormValues(current => ({ ...current, ...data }));
  }

  const paymentAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) {
      return [];
    }

    return accounts.filter(account => {
      const {
        tags,
        accountId,
        accountType: { id: accountTypeId },
      } = account;
      const index = tags.findIndex(tag => tag === 'receivable');

      return (
        accountTypeId === 'cash' ||
        (accountId !== 'opening_balance_adjustments' && index > -1)
      );
    });
  }, [accounts]);

  useEffect(() => {
    getPaymentModes();
    getVendors();
    getTaxes();
  }, [getPaymentModes, getVendors, getTaxes]);

  function finish(data) {
    updateFormValues(data);
    const newData = {
      ...formValues,
      ...data,
    };
    // console.log({ newData });
    handleFormSubmit(newData);
  }

  return loadingPaymentModes ||
    loadingVendors ||
    loadingTaxes ||
    loadingAccounts ? (
    <SkeletonLoader />
  ) : accounts?.length > 0 && paymentModes?.length > 0 ? (
    <Box w="full" h="full">
      <Stepper
        steps={[
          {
            label: 'Add Items',
            content: (
              <ExpenseItemsList
                updateFormValues={updateFormValues}
                defaultValues={formValues}
                taxes={taxes || []}
                loading={updating}
              />
            ),
          },
          {
            label: 'Payment Details',
            content: (
              <ExpenseForm
                vendors={vendors || []}
                paymentModes={paymentModes}
                accounts={accounts}
                defaultValues={formValues}
                loading={updating}
                updateFormValues={updateFormValues}
                handleFormSubmit={finish}
                summary={formValues?.summary}
                paymentAccounts={paymentAccounts}
              />
            ),
          },
        ]}
      />
    </Box>
  ) : (
    <Empty
      message={`${
        !accounts || accounts?.length === 0 ? 'Accounts data' : 'Payment modes'
      }  not found! Please try Reloading the page!`}
    />
  );
}

EditExpense.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  expense: PropTypes.shape({
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
    expenseDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    expenseSlug: PropTypes.string,
    expenseId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading: loadingPaymentModes, paymentModes } =
    state.paymentModesReducer;
  const { loading: loadingVendors, vendors } = state.vendorsReducer;
  const { loading: loadingTaxes, taxes } = state.taxesReducer;
  const { accounts } = state.accountsReducer;

  return {
    loadingPaymentModes,
    paymentModes,
    accounts,
    loadingVendors,
    vendors,
    loadingTaxes,
    taxes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
    getVendors: () => dispatch({ type: GET_VENDORS }),
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExpense);
