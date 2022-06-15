import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IconButton } from "@chakra-ui/react";
import { RiCloseFill } from "react-icons/ri";

import {
  UPDATE_SALES_RECEIPT,
  GET_SALES_RECEIPT,
} from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import EditSalesReceipt from "../../../containers/Management/SalesReceipts/EditSalesReceipt";

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

function EditSalesReceiptPage(props) {
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
    console.log({ data });
    updateInvoice({
      ...data,
      invoiceId,
    });
  }

  return (
    <PageLayout
      pageTitle={`Edit Sales Receipt ${invoice?.invoiceSlug}`}
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
      {loading && action === GET_SALES_RECEIPT ? (
        <SkeletonLoader />
      ) : invoice ? (
        <EditSalesReceipt
          updating={loading && action === UPDATE_SALES_RECEIPT}
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
    updateInvoice: (data) => dispatch({ type: UPDATE_SALES_RECEIPT, data }),
    resetInvoice: () => dispatch(reset()),
    getInvoice: (invoiceId) => dispatch({ type: GET_SALES_RECEIPT, invoiceId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSalesReceiptPage);
