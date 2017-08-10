import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

function UserConnectionsSort({className}) {
  return (
    <div className={`${className} people-sort`}>
      <a rel='name'>Name <span className='caret caret-reversed'/></a>
      <a rel='name' className='sent'># Sent <span className='caret caret-reversed'/></a>
      <a rel='received'># Received <span className='caret caret-reversed'/></a>
    </div>
  );
}

const StyledComponent = styled(UserConnectionsSort)`
  padding: 10px 20px;
  background-color: #e5e5e5;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  a {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    position: relative;
    display: inline-block;
    width: 100px;
  }
  @media (min-width: 1200px) {
    a {
      &:first-child {
        margin-left: 80px;
      }
      &:nth-child(2) {
        margin-left: 270px; 
      }
      &:nth-child(3) {
        margin-left: 35px;
      }
    }
  }
`;

export default StyledComponent;
