// import { useContext } from "react";
import { Routes, Route } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { isAdmin } from '../utils/roles';

import * as routes from '../nav/routes';

import ManagementRoutes from './ManagementRoutes';
import AdminRoutes from './AdminRoutes';

// import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

//auth
import LoginPage from '../pages/Auth/LoginPage';
import LogoutPage from '../pages/Auth/LogoutPage';
import CreateUserPage from '../pages/Auth/CreateUserPage';

function Router() {
  const userProfile = useAuth();
  // console.log({ userProfile });

  return (
    <>
      {' '}
      <Routes>
        <Route
          path={routes.LOGIN_USER}
          exact
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={routes.SIGNUP}
          exact
          element={
            <PublicRoute>
              <CreateUserPage />
            </PublicRoute>
          }
        />
        <Route path={routes.LOGOUT_USER} exact element={<LogoutPage />} />

        {isAdmin(userProfile?.role) ? AdminRoutes() : ManagementRoutes()}

        <Route path="*" element={<div>page not found</div>} />
      </Routes>
    </>
  );
}

export default Router;
