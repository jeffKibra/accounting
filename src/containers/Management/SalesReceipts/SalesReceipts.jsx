import { useEffect } from "react";
import { connect } from "react-redux";

import {
  GET_SALES_RECEIPTS,
  DELETE_SALES_RECEIPT,
} from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import SalesReceiptsTable from "../../../components/tables/SalesReceipts/SalesReceiptsTable";

function SalesReceipts(props) {
  const {
    loading,
    salesReceipts,
    action,
    isModified,
    getSalesReceipts,
    deleteSalesReceipt,
    resetSalesReceipt,
  } = props;

  useEffect(() => {
    getSalesReceipts();
  }, [getSalesReceipts]);

  useEffect(() => {
    if (isModified) {
      resetSalesReceipt();
      getSalesReceipts();
    }
  }, [isModified, resetSalesReceipt, getSalesReceipts]);

  return loading && action === GET_SALES_RECEIPTS ? (
    <SkeletonLoader />
  ) : salesReceipts?.length > 0 ? (
    <SalesReceiptsTable
      deleting={loading && action === DELETE_SALES_RECEIPT}
      isDeleted={isModified}
      handleDelete={deleteSalesReceipt}
      salesReceipts={salesReceipts}
    />
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, salesReceipts, action, isModified } =
    state.salesReceiptsReducer;

  return { loading, salesReceipts, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getSalesReceipts: () => dispatch({ type: GET_SALES_RECEIPTS }),
    deleteSalesReceipt: (salesReceiptId) =>
      dispatch({ type: DELETE_SALES_RECEIPT, salesReceiptId }),
    resetSalesReceipt: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesReceipts);
