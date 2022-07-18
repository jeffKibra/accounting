import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { GET_SALES_RECEIPT } from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import { SALES_RECEIPTS } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import SalesReceiptOptions from "../../../containers/Management/SalesReceipts/SalesReceiptOptions";
import ViewSalesReceipt from "../../../containers/Management/SalesReceipts/ViewSalesReceipt";

function ViewSalesReceiptPage(props) {
  const {
    loading,
    isModified,
    salesReceipt,
    action,
    resetSalesReceipt,
    getSalesReceipt,
  } = props;
  const { salesReceiptId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getSalesReceipt(salesReceiptId);
  }, [getSalesReceipt, salesReceiptId]);

  useEffect(() => {
    if (isModified) {
      resetSalesReceipt();
      navigate(SALES_RECEIPTS);
    }
  }, [isModified, resetSalesReceipt, navigate]);

  return (
    <PageLayout
      pageTitle={salesReceiptId || "Sales Receipt"}
      actions={
        salesReceipt && (
          <SalesReceiptOptions salesReceipt={salesReceipt} edit deletion />
        )
      }
    >
      {loading && action === GET_SALES_RECEIPT ? (
        <SkeletonLoader />
      ) : salesReceipt ? (
        <ViewSalesReceipt salesReceipt={salesReceipt} />
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
    resetSalesReceipt: () => dispatch(reset()),
    getSalesReceipt: (salesReceiptId) =>
      dispatch({ type: GET_SALES_RECEIPT, payload: salesReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewSalesReceiptPage);
