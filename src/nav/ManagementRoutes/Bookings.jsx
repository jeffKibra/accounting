import { Route } from 'react-router-dom';
import * as routes from '../routes';

import ManagementRoute from '../ManagementRoute';

//Bookings
import BookingsPage from '../../pages/Management/Bookings/BookingsPage';
import NewBookingPage from '../../pages/Management/Bookings/NewBookingPage';
import EditBookingPage from '../../pages/Management/Bookings/EditBookingPage';
// import ViewBookingPage from '../../pages/Management/Bookings/ViewBookingPage';
import ViewBookingInvoicePage from '../../pages/Management/Bookings/ViewBookingInvoicePage';

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
      path={routes.VIEW_BOOKING_INVOICE}
      key={routes.VIEW_BOOKING_INVOICE}
      exact
      element={
        <ManagementRoute>
          <ViewBookingInvoicePage />
        </ManagementRoute>
      }
    />,
  ];
}

export default Bookings;
