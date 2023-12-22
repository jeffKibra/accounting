import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

import DashboardPage from '../../pages/Management/Dashboard/DashboardPage';

//routes
import Orgs from './Orgs';
import Items from './Items';
import Customers from './Customers';
import Invoices from './Invoices';
import Bookings from './Bookings';
import Taxes from './Taxes';
import PaymentsReceived from './PaymentsReceived';
import Estimates from './Estimates';
import Expenses from './Expenses';
import SaleReceipts from './SaleReceipts';
import Vendors from './Vendors';
import CarModels from './CarModels';
//
import ChartOfAccounts from './ChartOfAccounts';
import ManualJournals from './ManualJournals';

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
    ...Bookings(),
    ...Taxes(),
    ...PaymentsReceived(),
    ...Estimates(),
    ...Expenses(),
    ...SaleReceipts(),
    ...Vendors(),
    ...CarModels(),

    ...ChartOfAccounts(),
    ...ManualJournals(),

    // ...ItemsCategories(),
  ];
}

export default ManagementRoutes;
