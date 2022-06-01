import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import {
  UPDATE_INVOICE,
  GET_INVOICE,
} from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import EditInvoice from "../../../containers/Management/Invoices/EditInvoice";

function getFormValuesOnly(invoice = {}) {
  const {
    customerId,
    customerNotes,
    dueDate,
    invoiceDate,
    invoiceSlug,
    invoiceId,
    summary,
    subject,
    selectedItems,
  } = invoice;

  return {
    customerId,
    customerNotes,
    dueDate,
    invoiceDate,
    invoiceSlug,
    invoiceId,
    summary,
    subject,
    selectedItems,
  };
}

function EditInvoicePage(props) {
  const {
    loading,
    action,
    isModified,
    invoice,
    updateInvoice,
    resetInvoice,
    getInvoice,
  } = props;
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getInvoice(invoiceId);
  }, [getInvoice, invoiceId]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(`/invoices/${invoiceId}/view`);
    }
  }, [isModified, resetInvoice, navigate, invoiceId]);

  function update(data) {
    console.log({ data });
    updateInvoice({
      ...data,
      invoiceId,
    });
  }

  return (
    <PageLayout pageTitle={`Edit Invoice ${invoice?.invoiceSlug}`}>
      {loading && action === GET_INVOICE ? (
        <SkeletonLoader />
      ) : invoice ? (
        <EditInvoice
          updating={loading && action === UPDATE_INVOICE}
          handleFormSubmit={update}
          invoice={getFormValuesOnly(invoice)}
        />
      ) : (
        <Empty message="Invoice not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, invoice } = state.invoicesReducer;

  return { loading, action, isModified, invoice };
}

function mapDispatchToProps(dispatch) {
  return {
    updateInvoice: (data) => dispatch({ type: UPDATE_INVOICE, data }),
    resetInvoice: () => dispatch(reset()),
    getInvoice: (invoiceId) => dispatch({ type: GET_INVOICE, invoiceId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoicePage);
