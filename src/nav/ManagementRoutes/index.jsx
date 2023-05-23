import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

import DashboardPage from '../../pages/Management/Dashboard/DashboardPage';

//routes
import Orgs from './Orgs';
import Items from './Items';
import Customers from './Customers';
import Invoices from './Invoices';
import Taxes from './Taxes';
import Payments from './Payments';
import Estimates from './Estimates';
import Expenses from './Expenses';
import SaleReceipts from './SaleReceipts';
import Vendors from './Vendors';
//
import ChartOfAccounts from './ChartOfAccounts';
import ManualJournals from './ManualJournals';

import ItemsCategories from './ItemsCategories';

function ManagementRoutes() {
  return [
    <Route
      path={routes.DASHBOARD}
      key={routes.DASHBOARD}
      exact
      element={
        <ManagementRoute>
          <DashboardPage />
        </ManagementRoute>
      }
    />,
    ...Orgs(),
    ...Items(),
    ...Customers(),
    ...Invoices(),
    ...Taxes(),
    ...Payments(),
    ...Estimates(),
    ...Expenses(),
    ...SaleReceipts(),
    ...Vendors(),

    ...ChartOfAccounts(),
    ...ManualJournals(),

    ...ItemsCategories(),
  ];
}

export default ManagementRoutes;
