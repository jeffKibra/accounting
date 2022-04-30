import { useEffect } from "react";
import { connect } from "react-redux";

import {
  GET_CUSTOMERS,
  DELETE_CUSTOMER,
} from "../../../store/actions/customersActions";
import { reset } from "../../../store/slices/customersSlice";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import CustomersTable from "../../../components/tables/Customers/CustomersTable";

function Customers(props) {
  const {
    loading,
    action,
    customers,
    isModified,
    getCustomers,
    deleteCustomer,
    resetCustomer,
  } = props;

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  useEffect(() => {
    if (isModified) {
      resetCustomer();
      getCustomers();
    }
  }, [isModified, resetCustomer, getCustomers]);

  return loading && action === GET_CUSTOMERS ? (
    <SkeletonLoader />
  ) : customers?.length > 0 ? (
    <CustomersTable
      customers={customers}
      handleDelete={deleteCustomer}
      deleting={loading && action === DELETE_CUSTOMER}
      isDeleted={isModified}
    />
  ) : (
    <Empty message="Customers not found!" />
  );
}

function mapStateToProps(state) {
  const { loading, action, customers, isModified } = state.customersReducer;

  return { loading, action, customers, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    deleteCustomer: (customerId) =>
      dispatch({ type: DELETE_CUSTOMER, customerId }),
    resetCustomer: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
