import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, collection } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { PAYMENTS_RECEIVED } from "../../../nav/routes";

import { CREATE_PAYMENT } from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import EditPayment from "../../../containers/Management/PaymentsReceived/EditPayment";

function NewPaymentPage(props) {
  const { loading, action, isModified, createPayment, resetPayment, orgId } =
    props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();

  const paymentId = useMemo(() => {
    return doc(collection(db, "organizations", orgId, "paymentsReceived")).id;
  }, [orgId]);

  console.log({ paymentId });

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(PAYMENTS_RECEIVED);
    }
  }, [isModified, resetPayment, navigate]);

  return (
    <PageLayout pageTitle="Receive Payment">
      <EditPayment
        paymentId={paymentId}
        updating={loading && action === CREATE_PAYMENT}
        saveData={createPayment}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.paymentsReducer;
  const orgId = state.orgsReducer.org.id;

  return { loading, action, isModified, orgId };
}

function mapDispatchToProps(dispatch) {
  return {
    createPayment: (data) => dispatch({ type: CREATE_PAYMENT, data }),
    resetPayment: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPaymentPage);
