/**
 * @desc Attaches a layout to a given route and checks for token in local storage
 */
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { LocalStorageService } from '../helper/utils';

const LayoutRoute = ({
  page: Component,
  layout: Layout,
  requireAuth,
  activeIcon,
  ...rest
}) => {
  const token = LocalStorageService.getAccessToken();
  // Check if token available for a restricted route, if not redirect to login page
  // else redirect to landing page
  if (requireAuth && token === null) {
    return <Navigate to={{ pathname: '/login' }} />;
  }
  if (requireAuth === false && token !== null) {
    return <Navigate to={{ pathname: '/' }} />;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (Layout) {
          return (
            <Layout activeMenu={activeIcon}>
              <Component {...props} />
            </Layout>
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default LayoutRoute;
