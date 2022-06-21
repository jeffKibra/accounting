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

function getFormValuesOnly(salesReceipt = {}) {
  const {
    customerId,
    customerNotes,
    receiptDate,
    salesReceiptId,
    accountId,
    paymentModeId,
    reference,
    summary,
    selectedItems,
  } = salesReceipt;

  return {
    customerId,
    customerNotes,
    receiptDate,
    salesReceiptId,
    accountId,
    paymentModeId,
    reference,
    summary,
    selectedItems,
  };
}

function EditSalesReceiptPage(props) {
  const {
    loading,
    action,
    isModified,
    salesReceipt,
    updateSalesReceipt,
    resetSalesReceipt,
    getSalesReceipt,
  } = props;
  const { salesReceiptId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();
  const viewRoute = `/sales-receipts/${salesReceiptId}/view`;

  useEffect(() => {
    getSalesReceipt(salesReceiptId);
  }, [getSalesReceipt, salesReceiptId]);

  useEffect(() => {
    if (isModified) {
      resetSalesReceipt();
      navigate(viewRoute);
    }
  }, [isModified, resetSalesReceipt, navigate, viewRoute]);

  function update(data) {
    updateSalesReceipt({
      ...data,
      salesReceiptId,
    });
  }

  return (
    <PageLayout
      pageTitle={`Edit ${salesReceiptId || "Sales Receipt"}`}
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
      ) : salesReceipt ? (
        <EditSalesReceipt
          updating={loading && action === UPDATE_SALES_RECEIPT}
          handleFormSubmit={update}
          salesReceipt={getFormValuesOnly(salesReceipt)}
        />
      ) : (
        <Empty message="Sales Receipt not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, salesReceipt } =
    state.salesReceiptsReducer;

  return { loading, action, isModified, salesReceipt };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSalesReceipt: (data) =>
      dispatch({ type: UPDATE_SALES_RECEIPT, data }),
    resetSalesReceipt: () => dispatch(reset()),
    getSalesReceipt: (salesReceiptId) =>
      dispatch({ type: GET_SALES_RECEIPT, salesReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSalesReceiptPage);