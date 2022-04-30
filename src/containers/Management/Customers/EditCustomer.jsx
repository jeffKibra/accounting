import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { CUSTOMERS } from "../../../nav/routes";
import {
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../../../store/actions/customersActions";
import { reset } from "../../../store/slices/customersSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import CustomerForm from "../../../components/forms/CustomerForms/CustomerForm";

function EditCustomer(props) {
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

  return loading && action === GET_CUSTOMER ? (
    <SkeletonLoader />
  ) : customer ? (
    <CustomerForm
      customer={customer}
      loading={loading && action === UPDATE_CUSTOMER}
      handleFormSubmit={update}
    />
  ) : (
    <Empty message="Customer not Found!" />
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, customer } = state.customersReducer;

  return { loading, action, isModified, customer };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomer: (customerId) => dispatch({ type: GET_CUSTOMER, customerId }),
    updateCustomer: (data) => dispatch({ type: UPDATE_CUSTOMER, data }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
