import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IconButton } from "@chakra-ui/react";
import { RiCloseFill } from "react-icons/ri";

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
    customer,
    customerNotes,
    dueDate,
    invoiceDate,
    invoiceId,
    summary,
    subject,
    selectedItems,
  } = invoice;

  return {
    customer,
    customerNotes,
    dueDate,
    invoiceDate,
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
  const viewRoute = `/invoices/${invoiceId}/view`;

  useEffect(() => {
    getInvoice(invoiceId);
  }, [getInvoice, invoiceId]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(viewRoute);
    }
  }, [isModified, resetInvoice, navigate, viewRoute]);

  function update(data) {
    updateInvoice({
      ...data,
      invoiceId,
    });
  }

  return (
    <PageLayout
      pageTitle={`Edit ${invoiceId || "Invoice"}`}
      actions={
        <Link to={viewRoute}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseFill />}
          />
        </Link>
      }
    >
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
    updateInvoice: (payload) => dispatch({ type: UPDATE_INVOICE, payload }),
    resetInvoice: () => dispatch(reset()),
    getInvoice: (invoiceId) =>
      dispatch({ type: GET_INVOICE, payload: invoiceId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoicePage);
