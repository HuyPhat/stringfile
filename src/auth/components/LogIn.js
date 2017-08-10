import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import sessionActions from '../actions';
import linkedinIcon from 'assets/images/linkedin_128x128.png';
import ENV_VARIABLES from 'config/variables';
// import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: {
        'auth': 'credential',
        'pin': {
          'id': '',
          'key': ''
        },
        'device': {
          'id': 'FSWEB' + Date.now() ,
          'name': 'Web App'
        }
      },
      validForm: false,
      show: false,
      target: null,
      popoverContent: '',
      showAlert: (this.props.error && this.props.error.code === 422) || false
    };
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.emailInput).focus();
  }

  componentWillReceiveProps(nextProps) {
    console.log('next props: ', nextProps);
    const { id, key } = this.state.payload.pin;
    const showAlert = nextProps.error && nextProps.error.code === 422;
    this.setState({showAlert});
    // if (nextProps.fetching) {
    //   this.props.showLoading();
    // }
    // else {
    //   this.props.hideLoading();
    // }
  }

  onChange = event => {
    const field = event.target.name;
    const payload = this.state.payload;
    payload.pin[field] = event.target.value;
    return this.setState({ payload: payload });
  };
  onSave = event => {
    const { id, key } = this.state.payload.pin;
    const { trigger } = this.state;
    event.preventDefault();
    if (!id) {
      this.setState({ target: ReactDOM.findDOMNode(this.refs.emailInput), show: !this.state.show, popoverContent: 'Please enter your email address!' });
    }
    else if (!id.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      this.setState({ target: ReactDOM.findDOMNode(this.refs.emailInput), show: !this.state.show, popoverContent: 'Please enter appropriate email address!' });
    }
    else if (!key) {
      this.setState({ target: ReactDOM.findDOMNode(this.refs.passwordInput), show: !this.state.show, popoverContent: 'Please enter your password!' });
    }
    else {
      this.props.actions.requestLogin(this.state.payload);
    }
  };
  onGetLinkedIn = () => {
    const redirect_uri = encodeURIComponent(window.location.origin + '/linkedin/oauth2/callback');
    const linkedin_state = Math.random().toString(36).substr(2, 10);
    let url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code';
    url += `&client_id=${ENV_VARIABLES.LINKEDIN_CLIENT_ID}`;
    url += '&redirect_uri=' + redirect_uri;
    url += '&state=' + linkedin_state;
    url += '&scope=r_basicprofile%20r_emailaddress';
    window.open(url,'_self');
  };

  removeAlert = () => {
    this.setState({showAlert: false});
  }
  render() {
    return (
      <div className='container'>
        {this.state.showAlert &&
          <div id='messageAlertTarget' className='alert alert-danger' >
            <button type='button' className='close' onClick={this.removeAlert}>
              <span aria-hidden='true'>×</span>
              <span className='sr-only'>Close</span>
            </button>
            {this.props.errorMessages.credentials}
          </div>
        }
        <div className='row'>
          <div className='login-form col-md-4 col-md-offset-4 col-sm-offset-0'>
            <h1 className='text-center'>
              A Better Way to Share<br /> Your Important Files
            </h1>
            <form>
              <div className='form-group no-border'>
                <input
                  type='email'
                  placeholder='Email Address'
                  className='form-control'
                  name='id'
                  value={this.state.payload.pin.id}
                  onChange={this.onChange}
                  ref='emailInput'/>
                <input
                  type='password'
                  placeholder='Password'
                  name='key'
                  className='form-control'
                  value={this.state.payload.pin.key}
                  onChange={this.onChange}
                  ref='passwordInput'/>
                <button
                  onClick={this.onSave}
                  className='btn btn-primary btn-block signin-btn'
                  disabled={this.props.fetching}
                >
                  Sign In
                </button>
                <a onClick={this.onGetLinkedIn} className='btn btn-default btn-block signup-btn btn-linkedin ng-binding'>
                  <img src={linkedinIcon} width='16' height='16'/>Sign in with LinkedIn</a>
                <Overlay
                  show={this.state.show}
                  target={this.state.target}
                  placement='right'
                  rootClose={true}
                  onHide={() => {this.setState({show: !this.state.show});}}
                >
                  <Popover id='popover-contained'>
                    {this.state.popoverContent}
                  </Popover>
                </Overlay>
              </div>
            </form>
            <p>
              <strong>
                <Link to='/forgot-password' >Forgot Password?</Link>
              </strong>
            </p>
            <p>Not a member? <strong><Link to='/sign-up'>Sign up now</Link></strong></p>
          </div>
        </div>
      </div>
    );
  }
}
LogInPage.propTypes = {
  actions: PropTypes.object,
  className: PropTypes.string,
  error: PropTypes.object,
  errorMessages: PropTypes.object,
  fetching: PropTypes.bool
};
LogInPage.defaultProps = {
  errorMessages: {
    credentials: 'The email address or password you entered is incorrect. Please enter again.'
  }
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
    // showLoading: bindActionCreators(showLoading, dispatch),
    // hideLoading: bindActionCreators(hideLoading, dispatch),
    // resetLoading: bindActionCreators(resetLoading, dispatch)
  };
}

export default withRouter(connect(state => ({error: state.authReducer.error, fetching: state.authReducer.fetching}), mapDispatchToProps)(LogInPage));
