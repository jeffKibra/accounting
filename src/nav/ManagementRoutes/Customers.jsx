import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//customers
import {
  ViewCustomerPage,
  CustomersPage,
  NewCustomerPage,
  EditCustomerPage,
} from "../../pages/Management/Customers";

function Customers() {
  return [
    <Route
      path={routes.CUSTOMERS}
      key={routes.CUSTOMERS}
      exact
      element={
        <ManagementRoute>
          <CustomersPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_CUSTOMER}
      key={routes.NEW_CUSTOMER}
      exact
      element={
        <ManagementRoute>
          <NewCustomerPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_CUSTOMER}
      key={routes.EDIT_CUSTOMER}
      exact
      element={
        <ManagementRoute>
          <EditCustomerPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_CUSTOMER}
      key={routes.VIEW_CUSTOMER}
      exact
      element={
        <ManagementRoute>
          <ViewCustomerPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Customers;
