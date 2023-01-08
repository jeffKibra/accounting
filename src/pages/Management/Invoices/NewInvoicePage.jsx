import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { INVOICES } from '../../../nav/routes';

import { CREATE_INVOICE } from '../../../store/actions/invoicesActions';
import { reset } from '../../../store/slices/invoicesSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import InvoiceForm from 'components/forms/Invoice/InvoiceForm';

function NewInvoicePage(props) {
  const { loading, action, isModified, createInvoice, resetInvoice } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(INVOICES);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout
      pageTitle="New Invoice"
      breadcrumbLinks={{
        Dashboard: '/',
        Invoices: INVOICES,
        'New Invoice': location.pathname,
      }}
    >
      <InvoiceForm
        updating={loading && action === CREATE_INVOICE}
        handleFormSubmit={createInvoice}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.invoicesReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createInvoice: payload => dispatch({ type: CREATE_INVOICE, payload }),
    resetInvoice: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewInvoicePage);
