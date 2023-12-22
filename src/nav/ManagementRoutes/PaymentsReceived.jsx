import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//payments received
import PaymentsReceivedListPage from '../../pages/Management/PaymentsReceived/PaymentsReceivedListPage';
import NewPaymentReceivedPage from '../../pages/Management/PaymentsReceived/NewPaymentReceivedPage';
import EditPaymentReceivedPage from '../../pages/Management/PaymentsReceived/EditPaymentReceivedPage';
import ViewPaymentReceivedPage from '../../pages/Management/PaymentsReceived/ViewPaymentReceivedPage';

function Payments() {
  return [
    <Route
      path={routes.PAYMENTS_RECEIVED}
      key={routes.PAYMENTS_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <PaymentsReceivedListPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_PAYMENT_RECEIVED}
      key={routes.NEW_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <NewPaymentReceivedPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_PAYMENT_RECEIVED}
      key={routes.EDIT_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <EditPaymentReceivedPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_PAYMENT_RECEIVED}
      key={routes.VIEW_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <ViewPaymentReceivedPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Payments;
