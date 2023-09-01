import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { SALE_RECEIPTS } from '../../../nav/routes';

import { CREATE_SALE_RECEIPT } from '../../../store/actions/saleReceiptsActions';
import { reset } from '../../../store/slices/saleReceiptsSlice';

import { useSavedLocation } from 'hooks';

//

import PageLayout from '../../../components/layout/PageLayout';
import EditSaleReceipt from 'containers/Management/SaleReceipts/EditSaleReceipt';

function NewSaleReceiptPage(props) {
  const { loading, action, isModified, createReceipt, resetReceipt } = props;
  useSavedLocation().setLocation();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetReceipt();
      navigate(SALE_RECEIPTS);
    }
  }, [isModified, resetReceipt, navigate]);

  return (
    <PageLayout
      pageTitle="New Sales Receipt"
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALE_RECEIPTS,
        'New Sales Receipt': location.pathname,
      }}
    >
      <EditSaleReceipt
        updating={loading && action === CREATE_SALE_RECEIPT}
        handleFormSubmit={createReceipt}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.saleReceiptsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createReceipt: payload => dispatch({ type: CREATE_SALE_RECEIPT, payload }),
    resetReceipt: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSaleReceiptPage);
