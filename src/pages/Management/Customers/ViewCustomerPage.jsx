import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import useSavedLocation from '../../../hooks/useSavedLocation';
import { CUSTOMERS } from '../../../nav/routes';
import {
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from '../../../store/actions/customersActions';
import { reset } from '../../../store/slices/customersSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';
import PageLayout from '../../../components/layout/PageLayout';
import ViewCustomer from '../../../containers/Management/Customers/ViewCustomer';
import CustomerOptions from '../../../containers/Management/Customers/CustomerOptions';

function ViewCustomerPage(props) {
  const {
    loading,
    action,
    isModified,
    customer,
    getCustomer,
    updateCustomer,
    resetCustomer,
  } = props;
  const navigate = useNavigate();
  const { customerId } = useParams();
  const location = useLocation();

  useSavedLocation().setLocation();

  useEffect(() => {
    getCustomer(customerId);
  }, [getCustomer, customerId]);

  useEffect(() => {
    if (isModified) {
      resetCustomer();
      if (action === DELETE_CUSTOMER) {
        navigate(CUSTOMERS);
      } else {
        getCustomer(customerId);
      }
    }
  }, [isModified, resetCustomer, navigate, action, getCustomer, customerId]);

  function update(data) {
    updateCustomer({ ...data, customerId });
  }

  return (
    <PageLayout
      pageTitle={customer?.displayName || 'Customer Details'}
      actions={
        customer && <CustomerOptions edit customer={customer} deletion />
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Customers: CUSTOMERS,
        [customerId]: location.pathname,
      }}
    >
      {loading && action === GET_CUSTOMER ? (
        <SkeletonLoader />
      ) : customer ? (
        (() => {
          const { createdAt, createdBy, modifiedAt, modifiedBy, ...rest } =
            customer;
          return (
            <ViewCustomer
              customer={rest}
              loading={loading && action === UPDATE_CUSTOMER}
              saveData={update}
            />
          );
        })()
      ) : (
        <Empty message="Customer not Found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, customer } = state.customersReducer;

  return { loading, action, isModified, customer };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomer: customerId =>
      dispatch({ type: GET_CUSTOMER, payload: customerId }),
    updateCustomer: payload => dispatch({ type: UPDATE_CUSTOMER, payload }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCustomerPage);
