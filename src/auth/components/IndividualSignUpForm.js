import React from 'react';
import PropTypes from 'prop-types';

function IndividualSignUpForm({signUpForm, onSubmitForm, onHandleChange, onToggleShowPassword, fetching}) {

  // textInput must be declared here so the ref callback can refer to it
  let firstNameInput = null;
  let lastNameInput = null;
  let emailInput = null;
  let passwordInput = null;

  function extractData(e) {
    e.preventDefault();
    const data = {
      first_name: firstNameInput.value.trim(),
      last_name: lastNameInput.value.trim(),
      identity: emailInput.value.trim(),
      password: passwordInput.value.trim()
    };
    onSubmitForm(data);
  }
  return (
    <form onSubmit={extractData}>
      <div className='fieldset'>
        <div className={signUpForm.submitted && !signUpForm.validFirstName ? 'form-group has-error' : 'form-group'}>
          <input className='form-control' ref={(input) => {firstNameInput = input;}} onChange={onHandleChange} name='firstName' type='text' placeholder='First Name' maxLength={128} required={false}/>
          {signUpForm.submitted && !signUpForm.validFirstName && <span className='help-block'>Please input your first name.</span>}
        </div>
        <div className={signUpForm.submitted && !signUpForm.validLastName ? 'form-group has-error' : 'form-group'}>
          <input className='form-control' ref={(input) => {lastNameInput = input;}} onChange={onHandleChange} name='lastName' type='text' placeholder='Last Name' maxLength={128} required={false}/>
          {signUpForm.submitted && !signUpForm.validLastName && <span className='help-block'>Please input your last name.</span>}
        </div>
        <div className={signUpForm.submitted && !signUpForm.validEmail ? 'form-group has-error' : 'form-group'}>
          <input className='form-control' ref={(input) => {emailInput = input;}} onChange={onHandleChange} name='email' type='text' placeholder='Email address' required={false}/>
          {signUpForm.submitted && !signUpForm.validEmail && <span className='help-block'>Please enter your email address in the format yourname@example.com.</span>}
        </div>
        <div className={signUpForm.submitted && !signUpForm.validPassword ? 'form-group has-error' : 'form-group'}>
          <div className='password-wrapper'>
            <span title='Show password' className='icon-view toggle-password' name='password' onMouseDown={onToggleShowPassword} onMouseUp={onToggleShowPassword}/>
            <input className='form-control' ref={(input) => {passwordInput = input;}} onChange={onHandleChange} name='password' type={signUpForm.passwordInputType} placeholder='Create a password for your account' minLength={4} maxLength={36} required={false}/>
          </div>
          <span className='help-block'>* Password length must be from 4 to 36 characters.</span>
        </div>
      </div>
      <div className='fieldset'>
        <p className='legal-notice'>
          By selecting <strong>Sign Up</strong>, I agree to FileString's <a href='http://www.filestring.com/terms-of-service' target='_blank'>Terms of Service</a>
        </p>
        <button type='submit' className='submit btn btn-primary' disabled={fetching}>Sign Up</button>
      </div>
    </form>
  );
}

IndividualSignUpForm.propTypes = {
  className: PropTypes.string
};

export default IndividualSignUpForm;
