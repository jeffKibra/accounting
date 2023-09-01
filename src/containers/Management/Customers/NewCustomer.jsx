import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CUSTOMERS } from "../../../nav/routes";

import { CREATE_CUSTOMER } from "../../../store/actions/customersActions";
import { reset } from "../../../store/slices/customersSlice";

import CustomerForm from "../../../components/forms/CustomerForms/CustomerForm";

function NewCustomer(props) {
  const { loading, action, isModified, createCustomer, resetCustomer } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetCustomer();
      navigate(CUSTOMERS);
    }
  }, [isModified, resetCustomer, navigate]);

  return (
    <CustomerForm
      loading={loading && action === CREATE_CUSTOMER}
      handleFormSubmit={createCustomer}
    />
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.customersReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createCustomer: (payload) => dispatch({ type: CREATE_CUSTOMER, payload }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCustomer);
