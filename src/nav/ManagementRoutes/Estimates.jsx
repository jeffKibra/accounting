import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//estimates
import EstimatesPage from "../../pages/Management/Estimates/EstimatesPage";

function Estimates() {
  return [
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
  ];
}

export default Estimates;
