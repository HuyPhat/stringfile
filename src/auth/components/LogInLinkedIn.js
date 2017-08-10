import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import sessionActions from '../actions';
import linkedinIcon from 'assets/images/linkedin_128x128.png';
import styled from 'styled-components';

class LogInLinkedIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      payload: {
        'auth': 'linkedin',
        'pin': {
          'id': null,
          'key': ''
        },
        'device': {
          'id': 'FSWEB' + Date.now(),
          'name': 'Web App'
        }
      }
    };
  }

  componentWillMount() {
    if (this.props.location) {
      const params = new URLSearchParams(this.props.location.search);
      const payload = this.state.payload;
      payload.pin.key = params.get('code');
      this.setState({payload: payload});
      this.props.actions.requestLogin(this.state.payload);
    }
  }

  render() {
    return null;
  }
}
LogInLinkedIn.propTypes = {
  actions: PropTypes.object,
  location: PropTypes.object
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
}
export default connect(null, mapDispatchToProps)(LogInLinkedIn);
