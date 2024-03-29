import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import useSavedLocation from '../../../hooks/useSavedLocation';
import { CUSTOMERS } from '../../../nav/routes';
import {
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
} from '../../../store/actions/customersActions';
import { reset } from '../../../store/slices/customersSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';
import PageLayout from '../../../components/layout/PageLayout';
import EditCustomer from '../../../containers/Management/Customers/EditCustomer';

function EditCustomerPage(props) {
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
      navigate(CUSTOMERS);
    }
  }, [isModified, resetCustomer, navigate]);

  function update(data) {
    updateCustomer({ ...data, customerId });
  }

  return (
    <PageLayout
      pageTitle="Edit Customer"
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
            <EditCustomer
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomerPage);
