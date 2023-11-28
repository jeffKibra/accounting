// import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  //  useNavigate,
  useLocation,
} from 'react-router-dom';

import { CUSTOMERS } from '../../../nav/routes';

import { CREATE_CUSTOMER } from '../../../store/actions/customersActions';
import { reset } from '../../../store/slices/customersSlice';
//
import { useCreateCustomer } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';

// import useSavedLocation from '../../../hooks/useSavedLocation';

import EditCustomer from '../../../containers/Management/Customers/EditCustomer';

function NewCustomerPage(props) {
  // const navigate = useNavigate();
  const location = useLocation();

  const { createContact, loading } = useCreateCustomer();

  // useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="New Customer"
      breadcrumbLinks={{
        Dashboard: '/',
        Customers: CUSTOMERS,
        'New Customer': location.pathname,
      }}
    >
      <EditCustomer loading={loading} saveData={createContact} />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.customersReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createCustomer: payload => dispatch({ type: CREATE_CUSTOMER, payload }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCustomerPage);
