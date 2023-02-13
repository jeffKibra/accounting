import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//accounts
import ChartOfAccountsListPage from '../../pages/Management/ChartOfAccounts/List';

function ChartOfAccounts() {
  return [
    <Route
      path={routes.CHART_OF_ACCOUNTS}
      key={routes.CHART_OF_ACCOUNTS}
      exact
      element={
        <ManagementRoute>
          <ChartOfAccountsListPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default ChartOfAccounts;
