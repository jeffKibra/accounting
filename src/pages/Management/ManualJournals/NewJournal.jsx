import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { MANUAL_JOURNALS } from 'nav/routes';

import { CREATE_MANUAL_JOURNAL } from 'store/actions/manualJournalsActions';
import { reset } from 'store/slices/manualJournalsSlice';

import { useSavedLocation, useTaxes } from 'hooks';

import PageLayout from 'components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import JournalForm from 'components/forms/Journal/JournalForm';

function NewJournalPage(props) {
  const { loading, action, isModified, createJournal, resetJournal, accounts } =
    props;
  console.log({ loading, action });
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

  const { taxes, isLoading: loadingTaxes } = useTaxes();

  useEffect(() => {
    if (isModified) {
      resetJournal();
      navigate(MANUAL_JOURNALS);
    }
  }, [isModified, resetJournal, navigate]);

  return (
    <PageLayout
      pageTitle="New Journal"
      breadcrumbLinks={{
        Dashboard: '/',
        'Journal List': MANUAL_JOURNALS,
        'New Journal': location.pathname,
      }}
    >
      {loadingTaxes ? (
        <SkeletonLoader />
      ) : (
        <JournalForm
          taxes={taxes}
          accounts={accounts}
          handleFormSubmit={createJournal}
          updating={loading && action === CREATE_MANUAL_JOURNAL}
        />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.manualJournalsReducer;
  const { accounts } = state?.accountsReducer;

  return { loading, action, isModified, accounts };
}

function mapDispatchToProps(dispatch) {
  return {
    createJournal: payload =>
      dispatch({ type: CREATE_MANUAL_JOURNAL, payload }),
    resetJournal: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewJournalPage);
