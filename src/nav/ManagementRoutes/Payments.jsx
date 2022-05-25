import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//payments received
import PaymentsPage from "../../pages/Management/Payments/PaymentsPage";
import NewPaymentPage from "../../pages/Management/Payments/NewPaymentPage";
import EditPaymentPage from "../../pages/Management/Payments/EditPaymentPage";
import ViewPaymentPage from "../../pages/Management/Payments/ViewPaymentPage";

function Payments() {
  return [
    <Route
      path={routes.PAYMENTS_RECEIVED}
      key={routes.PAYMENTS_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <PaymentsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_PAYMENT_RECEIVED}
      key={routes.NEW_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <NewPaymentPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_PAYMENT_RECEIVED}
      key={routes.EDIT_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <EditPaymentPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_PAYMENT_RECEIVED}
      key={routes.VIEW_PAYMENT_RECEIVED}
      exact
      element={
        <ManagementRoute>
          <ViewPaymentPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Payments;
