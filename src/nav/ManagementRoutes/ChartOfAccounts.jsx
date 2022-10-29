import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//customers
import { CustomersPage } from '../../pages/Management/Customers';

function ChartOfAccounts() {
  return [
    <Route
      path={routes.CHART_OF_ACCOUNTS}
      key={routes.CHART_OF_ACCOUNTS}
      exact
      element={
        <ManagementRoute>
          <CustomersPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default ChartOfAccounts;
