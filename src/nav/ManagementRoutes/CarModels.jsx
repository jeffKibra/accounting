import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//CarModels
import CarModelsPage from 'pages/Management/VehicleModels/CarModelsPage';
import NewCarModelPage from 'pages/Management/VehicleModels/NewCarModelPage';
import EditCarModelPage from 'pages/Management/VehicleModels/EditCarModelPage';

function CarModels() {
  return [
    <Route
      path={routes.CAR_MODELS}
      key={routes.CAR_MODELS}
      exact
      element={
        <ManagementRoute>
          <CarModelsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_CAR_MODEL}
      key={routes.NEW_CAR_MODEL}
      exact
      element={
        <ManagementRoute>
          <NewCarModelPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_CAR_MODEL}
      key={routes.EDIT_CAR_MODEL}
      exact
      element={
        <ManagementRoute>
          <EditCarModelPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default CarModels;
