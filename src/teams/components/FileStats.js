import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';

import FSComponent from 'components/FSComponent';
import {getUserTypeName, getStatusName} from 'utils/teams';
import {elapsedTime} from 'utils/DateTime';

export default class FileStats extends FSComponent {

  render() {
    const { user } = this.props;
    const text = this.text;
    return (
      <table className='table'>
        <tbody>
          <tr>
            <td>{ text.sent }</td>
            <td title='sent'>{user.stats.sent}</td>
          </tr>
          <tr>
            <td>{text.reshared}</td>
            <td title='reshared'>{user.stats.reshared}</td>
          </tr>
          <tr>
            <td>{text.received}</td>
            <td title='recieved'>{user.stats.received}</td>
          </tr>
          <tr>
            <td>{ text.unique_recipients}</td>
            <td title='recipients'>{user.stats.recipents}</td></tr>
        </tbody>
      </table>
    );
  }
}
