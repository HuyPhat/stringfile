import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sessionActions from '../actions';
import { history } from 'AppRoute';

class LogoutView extends React.Component {

  componentWillMount() {
    this.props.dispatch(sessionActions.requestLogout());
    history.push('/');
  }

  render() {
    return null;
  }
}

LogoutView.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(LogoutView);
