import { Route } from "react-router-dom";
import { EXPENSES, NEW_EXPENSE, EDIT_EXPENSE, VIEW_EXPENSE } from "../routes";

import ManagementRoute from "../ManagementRoute";

//expenses
import {
  EditExpensePage,
  ExpensesPage,
  NewExpensePage,
  ViewExpensePage,
} from "../../pages/Management/Expenses";

function Expenses() {
  return [
    <Route
      path={EXPENSES}
      key={EXPENSES}
      exact
      element={
        <ManagementRoute>
          <ExpensesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={NEW_EXPENSE}
      key={NEW_EXPENSE}
      exact
      element={
        <ManagementRoute>
          <NewExpensePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={EDIT_EXPENSE}
      key={EDIT_EXPENSE}
      exact
      element={
        <ManagementRoute>
          <EditExpensePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={VIEW_EXPENSE}
      key={VIEW_EXPENSE}
      exact
      element={
        <ManagementRoute>
          <ViewExpensePage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Expenses;
