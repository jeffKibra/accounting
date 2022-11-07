import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//accounts
import AccountsListPage from '../../pages/Management/Accounts/List';

function ChartOfAccounts() {
  return [
    <Route
      path={routes.CHART_OF_ACCOUNTS}
      key={routes.CHART_OF_ACCOUNTS}
      exact
      element={
        <ManagementRoute>
          <AccountsListPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default ChartOfAccounts;
