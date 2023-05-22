import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { GET_SALE_RECEIPT } from '../../../store/actions/salesReceiptsActions';
import { reset } from '../../../store/slices/salesReceiptsSlice';

import { SALES_RECEIPTS } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import SalesReceiptOptions from '../../../containers/Management/SalesReceipts/SaleReceiptOptions';
import ViewSaleReceipt from '../../../containers/Management/SalesReceipts/ViewSaleReceipt';

function ViewSaleReceiptPage(props) {
  const {
    loading,
    isModified,
    salesReceipt,
    action,
    resetSalesReceipt,
    getSalesReceipt,
  } = props;
  const { saleReceiptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getSalesReceipt(saleReceiptId);
  }, [getSalesReceipt, saleReceiptId]);

  useEffect(() => {
    if (isModified) {
      resetSalesReceipt();
      navigate(SALES_RECEIPTS);
    }
  }, [isModified, resetSalesReceipt, navigate]);

  return (
    <PageLayout
      pageTitle={saleReceiptId || 'Sales Receipt'}
      actions={
        salesReceipt && (
          <SalesReceiptOptions salesReceipt={salesReceipt} edit deletion />
        )
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALES_RECEIPTS,
        [saleReceiptId]: location.pathname,
      }}
    >
      {loading && action === GET_SALE_RECEIPT ? (
        <SkeletonLoader />
      ) : salesReceipt ? (
        <ViewSaleReceipt salesReceipt={salesReceipt} />
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
    getSalesReceipt: saleReceiptId =>
      dispatch({ type: GET_SALE_RECEIPT, payload: saleReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewSaleReceiptPage);
