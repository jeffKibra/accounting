import { useEffect } from "react";
import { connect } from "react-redux";

import {
  GET_PAYMENTS,
  DELETE_PAYMENT,
} from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import PaymentsTable from "../../../components/tables/Payments/PaymentsTable";

function Payments(props) {
  const {
    loading,
    payments,
    action,
    isModified,
    getPayments,
    deletePayment,
    resetPayment,
  } = props;

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      getPayments();
    }
  }, [isModified, resetPayment, getPayments]);

  return loading && action === GET_PAYMENTS ? (
    <SkeletonLoader />
  ) : payments?.length > 0 ? (
    <PaymentsTable
      deleting={loading && action === DELETE_PAYMENT}
      isDeleted={isModified}
      handleDelete={deletePayment}
      payments={payments}
    />
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, payments, action, isModified } = state.paymentsReducer;

  return { loading, payments, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getPayments: () => dispatch({ type: GET_PAYMENTS }),
    deletePayment: (paymentId) => dispatch({ type: DELETE_PAYMENT, paymentId }),
    resetPayment: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
