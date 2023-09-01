import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { SALE_RECEIPTS } from '../../../nav/routes';
import {
  UPDATE_SALE_RECEIPT,
  GET_SALE_RECEIPT,
} from '../../../store/actions/saleReceiptsActions';
import { reset } from '../../../store/slices/saleReceiptsSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import EditSaleReceipt from 'containers/Management/SaleReceipts/EditSaleReceipt';

function getFormValuesOnly(saleReceipt = {}) {
  const {
    customer,
    customerNotes,
    receiptDate,
    saleReceiptId,
    account,
    paymentMode,
    reference,
    summary,
    selectedItems,
  } = saleReceipt;

  return {
    customer,
    customerNotes,
    receiptDate,
    saleReceiptId,
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
    saleReceipt,
    updateSaleReceipt,
    resetSaleReceipt,
    getSaleReceipt,
  } = props;
  const { saleReceiptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/sale/sales-receipts/${saleReceiptId}/view`;

  useEffect(() => {
    getSaleReceipt(saleReceiptId);
  }, [getSaleReceipt, saleReceiptId]);

  useEffect(() => {
    if (isModified) {
      resetSaleReceipt();
      navigate(viewRoute);
    }
  }, [isModified, resetSaleReceipt, navigate, viewRoute]);

  function update(data) {
    updateSaleReceipt({
      ...data,
      saleReceiptId,
    });
  }

  return (
    <PageLayout
      pageTitle={`Edit ${saleReceiptId || 'Sales Receipt'}`}
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALE_RECEIPTS,
        [saleReceiptId]: location.pathname,
      }}
    >
      {loading && action === GET_SALE_RECEIPT ? (
        <SkeletonLoader />
      ) : saleReceipt ? (
        <EditSaleReceipt
          updating={loading && action === UPDATE_SALE_RECEIPT}
          handleFormSubmit={update}
          saleReceipt={getFormValuesOnly(saleReceipt)}
        />
      ) : (
        <Empty message="Sales Receipt not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, saleReceipt } =
    state.saleReceiptsReducer;

  return { loading, action, isModified, saleReceipt };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSaleReceipt: payload =>
      dispatch({ type: UPDATE_SALE_RECEIPT, payload }),
    resetSaleReceipt: () => dispatch(reset()),
    getSaleReceipt: saleReceiptId =>
      dispatch({ type: GET_SALE_RECEIPT, payload: saleReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSaleReceiptPage);
