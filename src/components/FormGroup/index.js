import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({className, children}) => (
  <div className={className}>{children}</div>
);

FormGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};

export default FormGroup;
