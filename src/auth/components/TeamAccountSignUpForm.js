import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function TeamAccountSignUpForm({className}) {
  return (
    <form className={className}>
      <p><strong>To continue, log in to your existing account.</strong></p>
      <div className='fieldset'>
        <div className='form-group'>
          <input className='form-control' name='email' type='email' placeholder='Email Address' maxLength={255} required={true}/>
          <span className='help-block'>Please input your first name.</span>
          <span className='help-block'>Invalid email address.</span>
        </div>
        <div className='form-group'>
          <input className='form-control' name='password' type='password' placeholder='Password' required={true}/>
          <span className='help-block'>Password can not be empty.</span>
        </div>
        <div className='form-group'>
          <button type='submit' className='submit btn btn-primary btn-block'>Continue</button>
        </div>
      </div>
    </form>
  );
}

TeamAccountSignUpForm.propTypes = {
  className: PropTypes.string
};

export default styled(TeamAccountSignUpForm)`
  .fieldset {
    padding-bottom: 20px;
  }
  hr {
    border-top-color: rgba(0,0,0,.1);
  }
  .help-block {
    font-size: 13px;
    color: #c0c5c9;
  }
  .password-wrapper {
    position: relative;
    margin-top: 6px;
    margin-bottom: 6px;
    .toggle-password {
      height: 16px;
      width: 20px;
      position: absolute;
      z-index: 1;
      right: 10px;
      top: 50%;
      margin-top: -8px;
      cursor: pointer;
      &:before {
        font-size: 16px;
        color: #9d9d9d;
      }
    }
  }
  .legal-notice {
    a {
      color: #2b5a94;
      font-weight: bold;  
    }
  }
`;
