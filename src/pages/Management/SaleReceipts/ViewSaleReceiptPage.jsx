import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { GET_SALE_RECEIPT } from '../../../store/actions/saleReceiptsActions';
import { reset } from '../../../store/slices/saleReceiptsSlice';

import { SALE_RECEIPTS } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import SaleReceiptOptions from '../../../containers/Management/SaleReceipts/SaleReceiptOptions';
import ViewSaleReceipt from '../../../containers/Management/SaleReceipts/ViewSaleReceipt';

function ViewSaleReceiptPage(props) {
  const {
    loading,
    isModified,
    saleReceipt,
    action,
    resetSaleReceipt,
    getSaleReceipt,
  } = props;
  const { saleReceiptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getSaleReceipt(saleReceiptId);
  }, [getSaleReceipt, saleReceiptId]);

  useEffect(() => {
    if (isModified) {
      resetSaleReceipt();
      navigate(SALE_RECEIPTS);
    }
  }, [isModified, resetSaleReceipt, navigate]);

  return (
    <PageLayout
      pageTitle={saleReceiptId || 'Sales Receipt'}
      actions={
        saleReceipt && (
          <SaleReceiptOptions saleReceipt={saleReceipt} edit deletion />
        )
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALE_RECEIPTS,
        [saleReceiptId]: location.pathname,
      }}
    >
      {loading && action === GET_SALE_RECEIPT ? (
        <SkeletonLoader />
      ) : saleReceipt ? (
        <ViewSaleReceipt saleReceipt={saleReceipt} />
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
    resetSaleReceipt: () => dispatch(reset()),
    getSaleReceipt: saleReceiptId =>
      dispatch({ type: GET_SALE_RECEIPT, payload: saleReceiptId }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewSaleReceiptPage);
