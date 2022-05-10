import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, collection } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { PAYMENTS_RECEIVED } from "../../../nav/routes";

import { CREATE_INVOICE } from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import EditPayment from "../../../containers/Management/PaymentsReceived/EditPayment";

function NewPaymentPage(props) {
  const { loading, action, isModified, createInvoice, resetInvoice, orgId } =
    props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();

  const paymentId = useMemo(() => {
    return doc(collection(db, "organizations", orgId, "paymentsReceived")).id;
  }, [orgId]);

  console.log({ paymentId });

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(PAYMENTS_RECEIVED);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout pageTitle="Receive Payment">
      <EditPayment
        paymentId={paymentId}
        updating={loading && action === CREATE_INVOICE}
        handleFormSubmit={createInvoice}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.invoicesReducer;
  const orgId = state.orgsReducer.org.id;

  return { loading, action, isModified, orgId };
}

function mapDispatchToProps(dispatch) {
  return {
    createInvoice: (data) => dispatch({ type: CREATE_INVOICE, data }),
    resetInvoice: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPaymentPage);
