import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { MANUAL_JOURNALS } from 'nav/routes';

import { CREATE_MANUAL_JOURNAL } from 'store/actions/manualJournalsActions';
import { reset } from 'store/slices/manualJournalsSlice';

import { useSavedLocation } from 'hooks';

import PageLayout from 'components/layout/PageLayout';
import EditJournal from 'containers/Management/ManualJournal/EditJournal';

function NewJournalPage(props) {
  const { loading, action, isModified, createJournal, resetJournal } = props;
  console.log({ loading, action });
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

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
      <EditJournal
        handleFormSubmit={createJournal}
        updating={loading && action === CREATE_MANUAL_JOURNAL}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.manualJournalsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createJournal: payload =>
      dispatch({ type: CREATE_MANUAL_JOURNAL, payload }),
    resetJournal: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewJournalPage);
