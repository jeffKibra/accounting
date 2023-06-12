import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//Bookings
import BookingsPage from '../../pages/Management/Bookings/BookingsPage';
import NewBookingPage from '../../pages/Management/Bookings/NewBookingPage';
import EditBookingPage from '../../pages/Management/Bookings/EditBookingPage';
import ViewBookingPage from '../../pages/Management/Bookings/ViewBookingPage';

function Bookings() {
  return [
    <Route
      path={routes.BOOKINGS}
      key={routes.BOOKINGS}
      exact
      element={
        <ManagementRoute>
          <BookingsPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.NEW_BOOKING}
      key={routes.NEW_BOOKING}
      exact
      element={
        <ManagementRoute>
          <NewBookingPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.EDIT_BOOKING}
      key={routes.EDIT_BOOKING}
      exact
      element={
        <ManagementRoute>
          <EditBookingPage />
        </ManagementRoute>
      }
    />,
    <Route
      path={routes.VIEW_BOOKING}
      key={routes.VIEW_BOOKING}
      exact
      element={
        <ManagementRoute>
          <ViewBookingPage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Bookings;
