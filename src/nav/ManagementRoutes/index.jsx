import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

import DashboardPage from "../../pages/Management/Dashboard/DashboardPage";

//routes
import Orgs from "./Orgs";
import Items from "./Items";
import Customers from "./Customers";
import Invoices from "./Invoices";
import Taxes from "./Taxes";
import PaymentsReceived from "./PaymentsReceived";
import Estimates from "./Estimates";
import Expenses from "./Expenses";
import SalesReceipts from "./SalesReceipts";

import ItemsCategories from "./ItemsCategories";

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
    ...PaymentsReceived(),
    ...Estimates(),
    ...Expenses(),
    ...SalesReceipts(),

    ...ItemsCategories(),
  ];
}

export default ManagementRoutes;
