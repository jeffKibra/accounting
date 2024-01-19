import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//VehicleModels
import VehicleModelsPage from 'pages/Management/VehicleModels/ListPage';
import NewVehicleModelPage from 'pages/Management/VehicleModels/NewPage';
import EditVehicleModelPage from 'pages/Management/VehicleModels/EditPage';

function VehicleModels() {
  return [
    <Route
      path={routes.VEHICLE_MODELS}
      key={routes.VEHICLE_MODELS}
      exact
      element={
        <ManagementRoute>
          <VehicleModelsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_VEHICLE_MODEL}
      key={routes.NEW_VEHICLE_MODEL}
      exact
      element={
        <ManagementRoute>
          <NewVehicleModelPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_VEHICLE_MODEL}
      key={routes.EDIT_VEHICLE_MODEL}
      exact
      element={
        <ManagementRoute>
          <EditVehicleModelPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default VehicleModels;
