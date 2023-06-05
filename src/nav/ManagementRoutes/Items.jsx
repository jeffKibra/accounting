import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//Items
import ItemsPage from 'pages/Management/Item/ItemsPage';
import NewItemPage from 'pages/Management/Item/NewItemPage';
import EditItemPage from 'pages/Management/Item/EditItemPage';
import ViewItemPage from 'pages/Management/Item/ViewItemPage';

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
    <Route
      path={routes.VIEW_ITEM}
      key={routes.VIEW_ITEM}
      exact
      element={
        <ManagementRoute>
          <ViewItemPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Items;
