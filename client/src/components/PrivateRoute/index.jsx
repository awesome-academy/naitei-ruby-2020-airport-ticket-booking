import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import StaffLogin from '../../components/StaffLogin';

const PrivateRoute = ({
  component: Component,
  authed,
  isUserAuth,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (isUserAuth) {
        return authed ? <Component {...props} /> : <Redirect to="/" />;
      } else {
        return authed ? <Component {...props} /> : <StaffLogin />;
      }
    }}
  />
);

export default PrivateRoute;
