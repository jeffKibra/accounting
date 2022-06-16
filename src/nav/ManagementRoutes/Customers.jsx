import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//customers
import CustomersPage from "../../pages/Management/Customers/CustomersPage";
import NewCustomerPage from "../../pages/Management/Customers/NewCustomerPage";
import EditCustomerPage from "../../pages/Management/Customers/EditCustomerPage";

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
  ];
}

export default Customers;
