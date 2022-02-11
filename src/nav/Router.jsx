import { Routes, Route } from "react-router-dom";
import * as routes from "../nav/routes";

import DashboardPage from "../pages/Dashboard/DashboardPage";
//customers
import CustomersPage from "../pages/Customers/CustomersPage";
import NewCustomerPage from "../pages/Customers/NewCustomerPage";
import EditCustomerPage from "../pages/Customers/EditCustomerPage";
//items
import ItemsPage from "../pages/Items/ItemsPage";
import NewItemPage from "../pages/Items/NewItemPage";
import EditItemPage from "../pages/Items/EditItemPage";
//sales Receipts
import SalesReceiptsPage from "../pages/SalesReceipts/SalesReceiptsPage";

//estimates
import EstimatesPage from "../pages/Estimates/EstimatesPage";

//invoices
import InvoicesPage from "../pages/Invoices/InvoicesPage";
//expenses
import ExpensesPage from "../pages/Expenses/ExpensesPage";
import NewExpensePage from "../pages/Expenses/NewExpensePage";

function Router() {
  return (
    <Routes>
      <Route path={routes.DASHBOARD} exact element={<DashboardPage />} />
      <Route path={routes.CUSTOMERS} exact element={<CustomersPage />} />
      <Route path={routes.NEW_CUSTOMER} exact element={<NewCustomerPage />} />
      <Route
        path={routes.EDIT_CUSTOMER}
        exact
        element={<EditCustomerPage />}
      />{" "}
      <Route path={routes.ITEMS} exact element={<ItemsPage />} />{" "}
      <Route path={routes.NEW_ITEM} exact element={<NewItemPage />} />{" "}
      <Route path={routes.EDIT_ITEM} exact element={<EditItemPage />} />{" "}
      <Route path={routes.ESTIMATES} exact element={<EstimatesPage />} />{" "}
      <Route path={routes.INVOICES} exact element={<InvoicesPage />} />
      <Route
        path={routes.SALES_RECEIPTS}
        exact
        element={<SalesReceiptsPage />}
      />
      <Route path={routes.EXPENSES} exact element={<ExpensesPage />} />
      <Route path={routes.NEW_EXPENSE} exact element={<NewExpensePage />} />
    </Routes>
  );
}

export default Router;
