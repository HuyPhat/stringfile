// author: wow so cool
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function ReviewInfo({className, userInfo}) {
  return (
    <div className={className}>
      <h3>Verify your email address</h3>
      <p>Check your email for a message from FileString with instructions on how to verify your email address.</p>
      <div className='signed-info'>
        <h4>You Signed As</h4>
        <p>
          <strong>Your Name:</strong> <span className='name'>{`${userInfo.firstName} ${userInfo.lastName}`}</span><br/>
          <strong>Your Email Address:</strong> <span className='email'> {userInfo.email}</span>
        </p>
      </div>
    </div>
  );
}

ReviewInfo.propTypes = {
  className: PropTypes.string,
  userInfo: PropTypes.object
};

export default styled(ReviewInfo)`
  margin-top: 20px;
  .signed-info {
    margin: 0 0 30px 0;
    padding-top: 20px;
    word-break: break-word;
    word-wrap: break-word;
  }
`;
