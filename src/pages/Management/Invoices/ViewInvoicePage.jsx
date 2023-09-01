import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import InvoiceOptions from '../../../containers/Management/Invoices/InvoiceOptions';

import { GET_INVOICE } from '../../../store/actions/invoicesActions';
import { reset } from '../../../store/slices/invoicesSlice';

import { INVOICES } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ViewInvoice from '../../../containers/Management/Invoices/ViewInvoice';

function ViewInvoicePage(props) {
  const { loading, isModified, invoice, action, resetInvoice, getInvoice } =
    props;
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
      pageTitle={invoice?.invoiceId || 'View Invoice'}
      actions={
        invoice && <InvoiceOptions invoice={invoice} edit deletion download />
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Invoices: INVOICES,
        [String(invoiceId).padStart(6, '0')]: location.pathname,
      }}
    >
      {loading && action === GET_INVOICE ? (
        <SkeletonLoader />
      ) : invoice ? (
        <ViewInvoice invoice={invoice} />
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
    getInvoice: invoiceId =>
      dispatch({ type: GET_INVOICE, payload: invoiceId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewInvoicePage);
