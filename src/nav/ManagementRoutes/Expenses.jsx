import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//expenses
import ExpensesPage from "../../pages/Management/Expenses/ExpensesPage";
import NewExpensePage from "../../pages/Management/Expenses/NewExpensePage";

function Expenses() {
  return [
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
  ];
}

export default Expenses;
