import { Route } from "react-router-dom";
import { VENDORS, NEW_VENDOR, EDIT_VENDOR } from "../routes";

import ManagementRoute from "../ManagementRoute";

//Vendors
import VendorsPage from "../../pages/Management/Vendors/VendorsPage";
import NewVendorPage from "../../pages/Management/Vendors/NewVendorPage";
import EditVendorPage from "../../pages/Management/Vendors/EditVendorPage";

function Vendors() {
  return [
    <Route
      path={VENDORS}
      key={VENDORS}
      exact
      element={
        <ManagementRoute>
          <VendorsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={NEW_VENDOR}
      key={NEW_VENDOR}
      exact
      element={
        <ManagementRoute>
          <NewVendorPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={EDIT_VENDOR}
      key={EDIT_VENDOR}
      exact
      element={
        <ManagementRoute>
          <EditVendorPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Vendors;
