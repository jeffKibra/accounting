import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//items
import ItemsPage from "../../pages/Management/Items/ItemsPage";
import NewItemPage from "../../pages/Management/Items/NewItemPage";
import EditItemPage from "../../pages/Management/Items/EditItemPage";

function Items() {
  return [
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
  ];
}

export default Items;
