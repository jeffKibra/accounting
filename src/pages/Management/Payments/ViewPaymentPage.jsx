import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { GET_PAYMENT } from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import { PAYMENTS } from "../../../nav/routes";

import PaymentOptions from "../../../containers/Management/Payments/PaymentOptions";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import ViewPayment from "../../../containers/Management/Payments/ViewPayment";

function ViewPaymentPage(props) {
  const { loading, action, isModified, payment, resetPayment, getPayment } =
    props;
  const { paymentId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getPayment(paymentId);
  }, [getPayment, paymentId]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(PAYMENTS);
    }
  }, [isModified, resetPayment, navigate]);

  return (
    <PageLayout
      pageTitle={payment?.paymentId || "View Payment"}
      actions={payment && <PaymentOptions payment={payment} edit deletion />}
    >
      {loading && action === GET_PAYMENT ? (
        <SkeletonLoader />
      ) : payment ? (
        <ViewPayment payment={payment} />
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
    resetPayment: () => dispatch(reset()),
    getPayment: (paymentId) =>
      dispatch({ type: GET_PAYMENT, payload: paymentId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPaymentPage);
