import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import {
  UPDATE_PAYMENT,
  GET_PAYMENT,
} from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import EditPayment from "../../../containers/Management/Payments/EditPayment";

function EditPaymentPage(props) {
  const {
    loading,
    action,
    isModified,
    payment,
    updatePayment,
    resetPayment,
    getPayment,
  } = props;
  const { paymentId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getPayment(paymentId);
  }, [getPayment, paymentId]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(-1);
    }
  }, [isModified, resetPayment, navigate]);

  function update(data) {
    console.log({ data });
    updatePayment({
      ...data,
      paymentId,
    });
  }

  return (
    <PageLayout pageTitle={`Edit Payment ${payment?.paymentSlug || ""}`}>
      {loading && action === GET_PAYMENT ? (
        <SkeletonLoader />
      ) : payment ? (
        <EditPayment
          updating={loading && action === UPDATE_PAYMENT}
          saveData={update}
          payment={payment}
        />
      ) : (
        <Empty message="payment not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, payment } = state.paymentsReducer;

  return { loading, action, isModified, payment };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePayment: (data) => dispatch({ type: UPDATE_PAYMENT, data }),
    resetPayment: () => dispatch(reset()),
    getPayment: (paymentId) => dispatch({ type: GET_PAYMENT, paymentId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentPage);
