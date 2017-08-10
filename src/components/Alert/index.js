// author: Phat Huy
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Alert({children, onClose, className}) {
  return (
    <div className={className}>
      <div id='messageAlertTarget' className='alert alert-danger' >
        <button type='button' className='close' onClick={onClose}>
          <span aria-hidden='true'>×</span>
          <span className='sr-only'>Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

Alert.propTypes = {
  children: PropTypes.string,
  onClose: PropTypes.func,
  content: PropTypes.string,
  className: PropTypes.string
};

export default styled(Alert)`
  .alert {
    position: relative;
    margin-top: 20px;
    margin-bottom: 0;
    .close {
      text-shadow: none;
      opacity: 1;
      filter: alpha(opacity=100);
      color: #ffffff;
    }
  }
`;
