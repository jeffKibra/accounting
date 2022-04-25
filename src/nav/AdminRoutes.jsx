import { Route } from "react-router-dom";
import * as routes from "./routes";

import AdminRoute from "./AdminRoute";

import DashboardPage from "../pages/Management/Dashboard/DashboardPage";
// import OrgsPage from "../pages/Admin/Orgs/OrgsPage";
// import NewOrgPage from "../pages/Admin/Orgs/NewOrgPage";
// import EditOrgPage from "../pages/Admin/Orgs/EditOrgPage";

function AdminRoutes() {
  return [
    <Route
      path={routes.DASHBOARD}
      key={routes.DASHBOARD}
      exact
      element={
        <AdminRoute>
          <DashboardPage />
        </AdminRoute>
      }
    />,
    // <Route
    //   path={routes.ADMIN_ORGS}
    //   key={routes.ADMIN_ORGS}
    //   exact
    //   element={
    //     <AdminRoute>
    //       <OrgsPage />
    //     </AdminRoute>
    //   }
    // />,
    // <Route
    //   path={routes.ADMIN_NEW_ORG}
    //   key={routes.ADMIN_NEW_ORG}
    //   exact
    //   element={
    //     <AdminRoute>
    //       <NewOrgPage />
    //     </AdminRoute>
    //   }
    // />,
    // <Route
    //   path={routes.ADMIN_EDIT_ORG}
    //   key={routes.ADMIN_EDIT_ORG}
    //   exact
    //   element={
    //     <AdminRoute>
    //       <EditOrgPage />
    //     </AdminRoute>
    //   }
    // />,
  ];
}

export default AdminRoutes;
