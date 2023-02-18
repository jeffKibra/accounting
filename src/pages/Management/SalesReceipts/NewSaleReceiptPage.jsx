import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { SALES_RECEIPTS } from '../../../nav/routes';

import { CREATE_SALES_RECEIPT } from '../../../store/actions/salesReceiptsActions';
import { reset } from '../../../store/slices/salesReceiptsSlice';

import { useSavedLocation } from 'hooks';

//

import PageLayout from '../../../components/layout/PageLayout';
import EditSaleReceipt from 'containers/Management/SalesReceipts/EditSaleReceipt';

function NewSaleReceiptPage(props) {
  const { loading, action, isModified, createReceipt, resetReceipt } = props;
  useSavedLocation().setLocation();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetReceipt();
      navigate(SALES_RECEIPTS);
    }
  }, [isModified, resetReceipt, navigate]);

  return (
    <PageLayout
      pageTitle="New Sales Receipt"
      breadcrumbLinks={{
        Dashboard: '/',
        'Sales Receipts': SALES_RECEIPTS,
        'New Sales Receipt': location.pathname,
      }}
    >
      <EditSaleReceipt
        updating={loading && action === CREATE_SALES_RECEIPT}
        handleFormSubmit={createReceipt}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.salesReceiptsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createReceipt: payload => dispatch({ type: CREATE_SALES_RECEIPT, payload }),
    resetReceipt: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSaleReceiptPage);
