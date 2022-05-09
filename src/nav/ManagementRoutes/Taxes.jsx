import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

///settings
//taxes
import TaxesPage from "../../pages/Management/Taxes/TaxesPage";
import NewTaxPage from "../../pages/Management/Taxes/NewTaxPage";
import EditTaxPage from "../../pages/Management/Taxes/EditTaxPage";

function Taxes() {
  return [
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

export default Taxes;
