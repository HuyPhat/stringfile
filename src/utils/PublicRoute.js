/**
 * Created by phathuy on 6/17/17.
 */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
// import Footer from 'components/Footer';
import SiteHeader from '../components/headers';
// import AppLoading from 'components/LoadingBar';

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true
          ? <Redirect to={{pathname: '/', state: { from: props.location }}}/>
          : <div>
            <SiteHeader />
            <div id='main'>
              <Component {...props} {...rest} />
            </div>
            {/* {Footer()} */}
          </div>}
    />
  );
}

PublicRoute.propTypes = {
  location: PropTypes.string,
  component: PropTypes.object,
  authed: PropTypes.bool
};
export default PublicRoute;
