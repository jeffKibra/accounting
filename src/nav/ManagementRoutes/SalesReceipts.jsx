import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//sales Receipts
import SalesReceiptsPage from "../../pages/Management/SalesReceipts/SalesReceiptsPage";

function SalesReceipts() {
  return [
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
  ];
}

export default SalesReceipts;
