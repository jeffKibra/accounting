import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import SalesReceiptOptions from "../../../containers/Management/salesReceipts/SalesReceiptOptions";

import { GET_SALES_RECEIPTS } from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import { INVOICES } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import ViewSalesReceipt from "../../../containers/Management/SalesReceipts/ViewSalesReceipt";

function ViewSalesReceiptPage(props) {
  const { loading, isModified, invoice, action, resetInvoice, getInvoice } =
    props;
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getInvoice(invoiceId);
  }, [getInvoice, invoiceId]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(INVOICES);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout
      pageTitle={invoice?.invoiceSlug || "View Sales Receipt"}
      actions={
        invoice && <SalesReceiptOptions invoice={invoice} edit deletion />
      }
    >
      {loading && action === GET_SALES_RECEIPTS ? (
        <SkeletonLoader />
      ) : invoice ? (
        <ViewSalesReceipt invoice={invoice} />
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
    resetInvoice: () => dispatch(reset()),
    getInvoice: (invoiceId) =>
      dispatch({ type: GET_SALES_RECEIPTS, invoiceId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewSalesReceiptPage);
