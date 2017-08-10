import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IndividualSignUpForm from 'auth/components/IndividualSignUpForm';
import TeamSignUpForm from 'auth/components/TeamSignUpForm';
import TeamAccountSignUpForm from 'auth/components/TeamAccountSignUpForm';
import actions from 'auth/actions';
import ReviewSignedUpAccount from 'auth/components/ReviewSignedUpAccount';

let SignUpForm = IndividualSignUpForm;

class ConnectedSignUpForm extends Component {

  state = {
    submitted: false,
    validFirstName: false,
    validLastName: false,
    validEmail: false,
    validPassword: false,
    formValid: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordInputType: 'password'
  };

  componentWillMount() {
    const { path } = this.props;
    if (path === '/sign-up/teams') {
      SignUpForm = TeamSignUpForm;
    } else if (path === '/sign-up/switch-to-team') {
      SignUpForm = TeamAccountSignUpForm;
    } else {
      SignUpForm = IndividualSignUpForm;
    }
  }

  handleToggleShowPassword = () => {
    let { passwordInputType } = this.state;
    if (passwordInputType === 'text') {
      passwordInputType = 'password';
    } else {
      passwordInputType = 'text';
    }
    this.setState({passwordInputType});
  };

  onSubmitForm = (data) => {
    this.setState({submitted: true});
    const {first_name, last_name, identity, password} = data;
    let { validFirstName, validLastName, validEmail, validPassword } = this.state;
    validFirstName = first_name.length > 0;
    validLastName = last_name.length > 0;
    validEmail = identity.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i); // match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[_a-z0-9-]+(\.[_a-z0-9-]+)+$/i)
    validPassword = password.length >= 4 && password.length <= 36;
    this.setState({
      validFirstName,
      validLastName,
      validEmail,
      validPassword
    }, this.validateForm);

    const newdata = {
      auth: 'credential',
      pin: {
        id: data.identity,
        key: data.password
      },
      subscription: this.props.path === '/sign-up/teams' ? 'team' : 'free',
      first_name: data.first_name,
      last_name: data.last_name,
      device: {
        id: 'PP123456',
        name: 'Corporate Web'
      }
    };
    if (this.state.formValid) {
      this.props.actions.requestSignUpStarter(newdata);
    } else {
      console.log('invalid form data');
    }
  };

  validateField(fieldName, value) {
    let { validFirstName, validLastName, validEmail, validPassword } = this.state;
    switch (fieldName) {
      case 'firstName':
        validFirstName = value.length > 0;
        break;
      case 'lastName':
        validLastName = value.length > 0;
        break;
      case 'email':
        validEmail = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i); // match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[_a-z0-9-]+(\.[_a-z0-9-]+)+$/i)
        break;
      case 'password':
        validPassword = value.length >= 4 && value.length <= 36;
        break;
      default:
        break;
    }
    this.setState({
      validFirstName,
      validLastName,
      validEmail,
      validPassword
    }, this.validateForm);
  }

  validateForm() {
    const { validFirstName, validLastName, validEmail, validPassword } = this.state;
    this.setState({formValid: validFirstName && validLastName && validEmail && validPassword});
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value.trim();
    this.setState({[name]: value}, () => {this.validateField(name, value);});
  };

  render() {
    const { successSignedUp, userInfo } = this.props;
    return (
      successSignedUp ? <ReviewSignedUpAccount userInfo={userInfo}/>
        : <SignUpForm
          signUpForm={this.state}
          onSubmitForm={this.onSubmitForm}
          onHandleChange={this.handleUserInput}
          onToggleShowPassword={this.handleToggleShowPassword}
          fetching={this.props.fetching}/>
    );
  }
}

ConnectedSignUpForm.propTypes = {
  path: PropTypes.string,
  actions: PropTypes.object,
  fetching: PropTypes.bool,
  signedUp: PropTypes.bool,
  errorMessage: PropTypes.string,
  successSignedUp: PropTypes.bool,
  userInfo: PropTypes.object
};

const mapDispatchToProp = (dispatch, ownProps) => ({
  actions: bindActionCreators(
    {
      requestSignUpStarter: actions.requestSignUpStarter
    },
    dispatch
  )
});

const mapStateToProps = state => {
  return {
    fetching: state.signupReducer.fetching,
    successSignedUp: !state.signupReducer.error && (state.signupReducer.payload === 1 || state.signupReducer.payload === 2),
    userInfo: {
      firstName: state.signupReducer.formData && state.signupReducer.formData.first_name,
      lastName: state.signupReducer.formData && state.signupReducer.formData.last_name,
      email: state.signupReducer.formData && state.signupReducer.formData.pin.id
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ConnectedSignUpForm);
