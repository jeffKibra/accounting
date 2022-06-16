import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//invoices
import InvoicesPage from "../../pages/Management/Invoices/InvoicesPage";
import NewInvoicePage from "../../pages/Management/Invoices/NewInvoicePage";
import EditInvoicePage from "../../pages/Management/Invoices/EditInvoicePage";
import ViewInvoicePage from "../../pages/Management/Invoices/ViewInvoicePage";

function Invoices() {
  return [
    <Route
      path={routes.INVOICES}
      key={routes.INVOICES}
      exact
      element={
        <ManagementRoute>
          <InvoicesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_INVOICE}
      key={routes.NEW_INVOICE}
      exact
      element={
        <ManagementRoute>
          <NewInvoicePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_INVOICE}
      key={routes.EDIT_INVOICE}
      exact
      element={
        <ManagementRoute>
          <EditInvoicePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_INVOICE}
      key={routes.VIEW_INVOICE}
      exact
      element={
        <ManagementRoute>
          <ViewInvoicePage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Invoices;
