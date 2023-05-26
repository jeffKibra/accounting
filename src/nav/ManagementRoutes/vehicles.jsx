import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//vehicles
import VehiclesPage from 'pages/Management/Vehicles/VehiclesPage';
import NewVehiclePage from 'pages/Management/Vehicles/NewVehiclePage';
import EditVehiclePage from 'pages/Management/Vehicles/EditVehiclePage';
import ViewVehiclePage from 'pages/Management/Vehicles/ViewVehiclePage';

function Vehicles() {
  return [
    <Route
      path={routes.VEHICLES}
      key={routes.VEHICLES}
      exact
      element={
        <ManagementRoute>
          <VehiclesPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_VEHICLE}
      key={routes.NEW_VEHICLE}
      exact
      element={
        <ManagementRoute>
          <NewVehiclePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_VEHICLE}
      key={routes.EDIT_VEHICLE}
      exact
      element={
        <ManagementRoute>
          <EditVehiclePage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_VEHICLE}
      key={routes.VIEW_VEHICLE}
      exact
      element={
        <ManagementRoute>
          <ViewVehiclePage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Vehicles;
