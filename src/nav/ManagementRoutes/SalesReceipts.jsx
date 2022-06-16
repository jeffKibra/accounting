import { Route } from "react-router-dom";
import {
  SALES_RECEIPTS,
  NEW_SALES_RECEIPT,
  EDIT_SALES_RECEIPT,
  VIEW_SALES_RECEIPT,
} from "../routes";

import ManagementRoute from "../ManagementRoute";

//sales Receipts
import SalesReceiptsPage from "../../pages/Management/SalesReceipts/SalesReceiptsPage";
import NewSalesReceiptPage from "../../pages/Management/SalesReceipts/NewSalesReceiptPage";
import EditSalesReceiptPage from "../../pages/Management/SalesReceipts/EditSalesReceiptPage";
import ViewSalesReceiptPage from "../../pages/Management/SalesReceipts/ViewSalesReceiptPage";

function SalesReceipts() {
  return [
    <Route
      path={SALES_RECEIPTS}
      key={SALES_RECEIPTS}
      exact
      element={
        <ManagementRoute>
          <SalesReceiptsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={NEW_SALES_RECEIPT}
      key={NEW_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <NewSalesReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={EDIT_SALES_RECEIPT}
      key={EDIT_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <EditSalesReceiptPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={VIEW_SALES_RECEIPT}
      key={VIEW_SALES_RECEIPT}
      exact
      element={
        <ManagementRoute>
          <ViewSalesReceiptPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default SalesReceipts;
