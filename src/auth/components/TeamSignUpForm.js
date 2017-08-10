import React from 'react';
import PropTypes from 'prop-types';

function TeamSignUpForm({className}) {
  return (
    <form className={className}>
      <input type='hidden' value='team' name='subscription' autoComplete='off'/>
      <div className='fieldset'>
        <div className='form-group'>
          <input className='form-control' name='first-name' type='text' placeholder='First Name' maxLength={128} required={true}/>
          <span className='help-block'>Please input your first name.</span>
        </div>
        <div className='form-group'>
          <input className='form-control' name='last-name' type='text' placeholder='Last Name' maxLength={128} required={true}/>
          <span className='help-block'>Please input your last name.</span>
        </div>
        <div className='form-group'>
          <input className='form-control' name='identity' type='email' placeholder='Email address' required={true}/>
          <span className='help-block'>Please enter your email address in the format yourname@example.com.</span>
        </div>
        <div className='form-group'>
          <div className='password-wrapper'>
            <span title='Show password' className='icon-view toggle-password' name='password'/>
            <input className='form-control' name='password' type='password' placeholder='Create a password for your account' minLength={4} maxLength={36} required={true}/>
          </div>
          <span className='help-block visible'>* Password length must be from 4 to 36 characters.</span>
        </div>
      </div>
      <div className='fieldset'>
        <p><strong>About your team/company</strong></p>
        <div className='form-group'>
          <input className='form-control' name='team-name' type='text' placeholder='Team name' maxLength={100} required={true}/>
          <span className='help-block'>Please enter team name.</span>
        </div>
        <div className='form-group'>
          <input className='form-control' name='team-domain' type='text' placeholder='Internet domain (e.g. yourcompany.com)' maxLength={100} required={true}/>
          <span className='help-block'>Please enter your internet domain in the format example.com.</span>
        </div>
        <div className='form-group'>
          <input className='form-control' name='team_size' type='text' placeholder='Team/company size' maxLength={100} required={true}/>
        </div>
        <div className='form-group'>
          <input className='form-control' name='team-phone' type='text' placeholder='Contact phone number' maxLength={100} required={true}/>
          <span className='help-block'>Please enter phone number.</span>
        </div>
      </div>
      <div className='fieldset'>
        <p className='legal-notice'>
          By selecting <strong>Sign Up</strong>, I agree to FileString's <a href='http://www.filestring.com/terms-of-service' target='_blank'>Terms of Service</a>
        </p>
        <button type='submit' className='submit btn btn-primary'>Sign Up</button>
      </div>
    </form>
  );
}

TeamSignUpForm.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default TeamSignUpForm;
