import { Route } from "react-router-dom";
import * as routes from "../routes";

import ManagementRoute from "../ManagementRoute";

//items
import ItemsCategoriesPage from "../../pages/Management/ItemsCategories/ItemsCategoriesPage";
import NewItemCategoryPage from "../../pages/Management/ItemsCategories/NewItemCategoryPage";
import EditItemCategoryPage from "../../pages/Management/ItemsCategories/EditItemCategoryPage";

function ItemsCategories() {
  return [
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
  ];
}

export default ItemsCategories;
