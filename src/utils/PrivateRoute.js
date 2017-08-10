/**
 * Created by huyphat on 23/05/2017.
 */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
// import Spinner from 'components/Spinner';
// import AppLoading from 'components/LoadingBar';

const PrivateRoute = ({ component: Component, authed, routes, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      authed === true
        ? <Component {...Object.assign(props, {routes: routes})} />
        : <Redirect to={{ pathname: '/sign-in', state: { from: props.location }}}/>
    }
  />;
PrivateRoute.propTypes = {
  location: PropTypes.string,
  component: PropTypes.object,
  routes: PropTypes.array,
  authed: PropTypes.bool
};
export default PrivateRoute;
