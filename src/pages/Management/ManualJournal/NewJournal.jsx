import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { MANUAL_JOURNALS } from '../../../nav/routes';

import { CREATE_INVOICE } from '../../../store/actions/invoicesActions';
import { reset } from '../../../store/slices/invoicesSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';

import JournalForm from 'components/forms/Journal/JournalForm';

function NewJournalPage(props) {
  const { loading, action, isModified, createInvoice, resetInvoice } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(MANUAL_JOURNALS);
    }
  }, [isModified, resetInvoice, navigate]);

  return (
    <PageLayout
      pageTitle="New Journal"
      breadcrumbLinks={{
        Dashboard: '/',
        'Journal List': MANUAL_JOURNALS,
        'New Journal': location.pathname,
      }}
    >
      <JournalForm handleFormSubmit={() => console.log('plus')} />
      {/* <EditInvoice
        updating={loading && action === CREATE_INVOICE}
        handleFormSubmit={createInvoice}
      /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewJournalPage);
