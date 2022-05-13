import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CUSTOMERS } from "../../../nav/routes";

import { CREATE_CUSTOMER } from "../../../store/actions/customersActions";
import { reset } from "../../../store/slices/customersSlice";

import PageLayout from "../../../components/layout/PageLayout";

import useSavedLocation from "../../../hooks/useSavedLocation";

import EditCustomer from "../../../containers/Management/Customers/EditCustomer";

function NewCustomerPage(props) {
  const { loading, action, isModified, createCustomer, resetCustomer } = props;
  const navigate = useNavigate();

  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetCustomer();
      navigate(CUSTOMERS);
    }
  }, [isModified, resetCustomer, navigate]);

  return (
    <PageLayout pageTitle="New Customer">
      <EditCustomer
        loading={loading && action === CREATE_CUSTOMER}
        saveData={createCustomer}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.customersReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createCustomer: (data) => dispatch({ type: CREATE_CUSTOMER, data }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCustomerPage);
