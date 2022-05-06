import { Route } from "react-router-dom";
import * as routes from "./routes";

import ManagementRoute from "./ManagementRoute";

import DashboardPage from "../pages/Management/Dashboard/DashboardPage";
//orgs
import NewOrgPage from "../pages/Management/Orgs/NewOrgPage";
//customers
import CustomersPage from "../pages/Management/Customers/CustomersPage";
import NewCustomerPage from "../pages/Management/Customers/NewCustomerPage";
import EditCustomerPage from "../pages/Management/Customers/EditCustomerPage";
//items
import ItemsPage from "../pages/Management/Items/ItemsPage";
import NewItemPage from "../pages/Management/Items/NewItemPage";
import EditItemPage from "../pages/Management/Items/EditItemPage";
//sales Receipts
import SalesReceiptsPage from "../pages/Management/SalesReceipts/SalesReceiptsPage";

//estimates
import EstimatesPage from "../pages/Management/Estimates/EstimatesPage";

//invoices
import InvoicesPage from "../pages/Management/Invoices/InvoicesPage";
import NewInvoicePage from "../pages/Management/Invoices/NewInvoicePage";
import EditInvoicePage from "../pages/Management/Invoices/EditInvoicePage";
import ViewInvoicePage from "../pages/Management/Invoices/ViewInvoicePage";
//expenses
import ExpensesPage from "../pages/Management/Expenses/ExpensesPage";
import NewExpensePage from "../pages/Management/Expenses/NewExpensePage";
//items
import ItemsCategoriesPage from "../pages/Management/ItemsCategories/ItemsCategoriesPage";
import NewItemCategoryPage from "../pages/Management/ItemsCategories/NewItemCategoryPage";
import EditItemCategoryPage from "../pages/Management/ItemsCategories/EditItemCategoryPage";
//settings
//taxes
import TaxesPage from "../pages/Management/Taxes/TaxesPage";
import NewTaxPage from "../pages/Management/Taxes/NewTaxPage";
import EditTaxPage from "../pages/Management/Taxes/EditTaxPage";

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
    <Route
      path={routes.NEW_ORG}
      key={routes.NEW_ORG}
      exact
      element={
        <ManagementRoute>
          <NewOrgPage />
        </ManagementRoute>
      }
    />,
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
      path={routes.ITEMS}
      key={routes.ITEMS}
      exact
      element={
        <ManagementRoute>
          <ItemsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_ITEM}
      key={routes.NEW_ITEM}
      exact
      element={
        <ManagementRoute>
          <NewItemPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_ITEM}
      key={routes.EDIT_ITEM}
      exact
      element={
        <ManagementRoute>
          <EditItemPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.ESTIMATES}
      key={routes.ESTIMATES}
      exact
      element={
        <ManagementRoute>
          <EstimatesPage />
        </ManagementRoute>
      }
    />,
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
    <Route
      path={routes.SALES_RECEIPTS}
      key={routes.SALES_RECEIPTS}
      exact
      element={
        <ManagementRoute>
          <SalesReceiptsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EXPENSES}
      key={routes.EXPENSES}
      exact
      element={
        <ManagementRoute>
          <ExpensesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_EXPENSE}
      key={routes.NEW_EXPENSE}
      exact
      element={
        <ManagementRoute>
          <NewExpensePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.ITEMS_CATEGORIES}
      key={routes.ITEMS_CATEGORIES}
      exact
      element={
        <ManagementRoute>
          <ItemsCategoriesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_ITEM_CATEGORY}
      key={routes.NEW_ITEM_CATEGORY}
      exact
      element={
        <ManagementRoute>
          <NewItemCategoryPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_ITEM_CATEGORY}
      key={routes.EDIT_ITEM_CATEGORY}
      exact
      element={
        <ManagementRoute>
          <EditItemCategoryPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.TAXES}
      key={routes.TAXES}
      exact
      element={
        <ManagementRoute>
          <TaxesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_TAX}
      key={routes.NEW_TAX}
      exact
      element={
        <ManagementRoute>
          <NewTaxPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_TAX}
      key={routes.EDIT_TAX}
      exact
      element={
        <ManagementRoute>
          <EditTaxPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default ManagementRoutes;
