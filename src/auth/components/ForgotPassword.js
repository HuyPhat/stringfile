import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import TextInput from './common/TextInput';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sessionActions from '../actions';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { payload:
      {
        email: ''
      }
    };
  }
  onChange = event => {
    const field = event.target.name;
    const payload = this.state.payload;
    payload[field] = event.target.value;
    return this.setState(payload: payload);
  };
  sendRequest = (event) => {
    event.preventDefault();
    this.props.dispatch(sessionActions.forgotPassword(this.state.payload));
  }

  render() {
    const { response, messages } = this.props;
    return (
      <div className='container'>
        <div className='row' >
          {response && response.meta && response.meta.code > 200 && <div className='alert alert-danger fade in'><span>{response.meta.message}</span></div>}
          {response && response.meta && response.meta.code < 400 && <div className='alert alert-success fade in'>{messages.requestSuccess}<span /></div>}
          <div className='login-form col-md-6 col-md-offset-3 col-sm-offset-0'>
            <p>Enter your email address to reset your password.
              You will receive an email from FileString with a link to create a new password.
              Check your spam folder if you can’t find the message.</p>
            <form>
              <div className='form-group no-border'>
                <input
                  type='email'
                  placeholder='Your Email Address'
                  className='form-control'
                  name='email'
                  value={this.state.payload.email}
                  onChange={this.onChange}
                />
              </div>
              <button className='btn btn-primary btn-block forgot-btn' onClick={this.sendRequest}>Request Reset Link</button>
              <p><strong><Link to='/sign-in'>Back to Sign In</Link></strong></p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func,
  response: PropTypes.object,
  messages: PropTypes.object
};

ForgotPassword.defaultProps = {
  messages: {
    requestSuccess: 'An email with instructions to create a new password has been sent to your email address.'
  }
};

const mapStateToProps = state => {
  const { authReducer } = state;
  return {
    response: state.authReducer.payload
  };
};
export default connect(mapStateToProps)(ForgotPassword);
