import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Router } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import routes from './config/routes';
import auth from './auth/authenticator';
import createHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';
// import LoadingBar from 'react-redux-loading-bar';

export const history = createHistory();
const supportsHistory = 'pushState' in window.history;

const AppRouter = ({authenticated}) => {
  // console.log(autheticated);
  return <Router history={history}>
    <div className='app-view'>
      {/*<LoadingBar showFastActions />*/}
      <Switch>
        {routes.map(
          (route, i) =>
            route.private === true
              ? PrivateRoute({
                authed: authenticated,
                component: route.component,
                routes: route.routes,
                path: route.path,
                key: { i }
              })
              : PublicRoute({
                authed: authenticated,
                component: route.component,
                path: route.path,
                routes: route.routes,
                key: { i }
              })
        )}
      </Switch>
    </div>
  </Router>;
};
AppRouter.propTypes = {
  authenticated: PropTypes.bool
};
/*eslint-disable */
export default connect(state => ({
  authenticated: auth.loggedIn()
}))(AppRouter);
/*eslint-enable */
