import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  UPDATE_INVOICE,
  GET_INVOICE,
} from '../../../store/actions/invoicesActions';
import { reset } from '../../../store/slices/invoicesSlice';

import { INVOICES } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import InvoiceForm from 'components/forms/Invoice/InvoiceForm';

function getFormValuesOnly(invoice = {}) {
  const {
    customer,
    customerNotes,
    dueDate,
    invoiceDate,
    invoiceId,
    summary,
    subject,
    selectedItems,
    saleType,
  } = invoice;

  return {
    customer,
    customerNotes,
    dueDate,
    invoiceDate,
    invoiceId,
    summary,
    subject,
    selectedItems,
    saleType,
  };
}

function EditInvoicePage(props) {
  const {
    loading,
    action,
    isModified,
    invoice,
    updateInvoice,
    resetInvoice,
    getInvoice,
  } = props;
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/sale/invoices/${invoiceId}/view`;

  useEffect(() => {
    getInvoice(invoiceId);
  }, [getInvoice, invoiceId]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(viewRoute);
    }
  }, [isModified, resetInvoice, navigate, viewRoute]);

  function update(data) {
    updateInvoice({
      ...data,
      invoiceId,
    });
  }

  return (
    <PageLayout
      pageTitle={`Edit ${invoiceId || 'Invoice'}`}
      breadcrumbLinks={{
        Dashboard: '/',
        Invoices: INVOICES,
        [String(invoiceId).padStart(6, '0')]: location.pathname,
      }}
    >
      {loading && action === GET_INVOICE ? (
        <SkeletonLoader />
      ) : invoice ? (
        <InvoiceForm
          updating={loading && action === UPDATE_INVOICE}
          handleFormSubmit={update}
          invoice={getFormValuesOnly(invoice)}
        />
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
    updateInvoice: payload => dispatch({ type: UPDATE_INVOICE, payload }),
    resetInvoice: () => dispatch(reset()),
    getInvoice: invoiceId =>
      dispatch({ type: GET_INVOICE, payload: invoiceId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoicePage);
