import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//journals
import JournalListPage from '../../pages/Management/ManualJournals/JournalListPage';
import NewJournalPage from '../../pages/Management/ManualJournals/NewJournalPage';
import EditJournalPage from '../../pages/Management/ManualJournals/EditJournalPage';

function ManualJournals() {
  return [
    <Route
      path={routes.MANUAL_JOURNALS}
      key={routes.MANUAL_JOURNALS}
      exact
      element={
        <ManagementRoute>
          <JournalListPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_MANUAL_JOURNAL}
      key={routes.NEW_MANUAL_JOURNAL}
      exact
      element={
        <ManagementRoute>
          <NewJournalPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_MANUAL_JOURNAL}
      key={routes.EDIT_MANUAL_JOURNAL}
      exact
      element={
        <ManagementRoute>
          <EditJournalPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default ManualJournals;
