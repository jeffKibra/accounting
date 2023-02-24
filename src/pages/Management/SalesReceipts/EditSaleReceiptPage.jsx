import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { SALES_RECEIPTS } from '../../../nav/routes';
import {
  UPDATE_SALES_RECEIPT,
  GET_SALES_RECEIPT,
} from '../../../store/actions/salesReceiptsActions';
import { reset } from '../../../store/slices/salesReceiptsSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import EditSaleReceipt from 'containers/Management/SalesReceipts/EditSaleReceipt';

function getFormValuesOnly(salesReceipt = {}) {
  const {
    customer,
    customerNotes,
    receiptDate,
    salesReceiptId,
    account,
    paymentMode,
    reference,
    summary,
    selectedItems,
  } = salesReceipt;

  return {
    customer,
    customerNotes,
    receiptDate,
    salesReceiptId,
    account,
    paymentMode,
    reference,
    summary,
    selectedItems,
  };
}

function EditSaleReceiptPage(props) {
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
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/sale/sales-receipts/${salesReceiptId}/view`;

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
      pageTitle={`Edit ${salesReceiptId || 'Sales Receipt'}`}
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALES_RECEIPTS,
        [salesReceiptId]: location.pathname,
      }}
    >
      {loading && action === GET_SALES_RECEIPT ? (
        <SkeletonLoader />
      ) : salesReceipt ? (
        <EditSaleReceipt
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
    updateSalesReceipt: payload =>
      dispatch({ type: UPDATE_SALES_RECEIPT, payload }),
    resetSalesReceipt: () => dispatch(reset()),
    getSalesReceipt: salesReceiptId =>
      dispatch({ type: GET_SALES_RECEIPT, payload: salesReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSaleReceiptPage);