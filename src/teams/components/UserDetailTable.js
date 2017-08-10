import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactTooltip from 'react-tooltip';

import FSComponent from 'components/FSComponent';
import {getUserTypeName, getStatusName} from 'utils/teams';
import {elapsedTime} from 'utils/DateTime';
import {isPasswordChanged, checkPermission} from 'utils/teams';

class UserDetailTable extends FSComponent {
    static propTypes = {
      user: PropTypes.object,
      loggedUser: PropTypes.object,
      resendInvitation: PropTypes.func
    }

    render() {
      const { user, resendInvitation, handleResetPwd, loggedUser, loading } = this.props;
      const text = this.text;
      return (
        <table className='table' >
          <tbody>
            <tr>
              <td >{text.job_title}</td>
              <td>{user.job_title}</td>
            </tr>
            <tr>
              <td >{text.role}</td>
              <td data-tip={getUserTypeName(user.team.member_type)}>{getUserTypeName(user.team.member_type)}</td>
            </tr>
            <tr>
              <td>{text.created}</td>
              <td>{elapsedTime(user.created_date)}</td>
            </tr>
            {user.status !== 0 &&
                 <tr >
                   <td>{text.joined}</td>
                   <td>{elapsedTime(user.registration_date)}</td>
                 </tr>
            }
            {user.status === 0 &&
                    <tr >
                      <td>{text.invitation_sent}</td>
                      <td>{elapsedTime(user.invitation_sent_date)}</td>
                    </tr>
            }
            {!user.emails.is_verify && user.status !== 0 &&
                    <tr>
                      <td>{text.new_email_address}</td>
                      <td>{ user.emails.primary }<span className='help-block'>Unverified</span></td>
                    </tr>
            }
            {!user.emails.is_verify && user.status !== 0 &&
                    <tr>
                      <td>{text.verificaton_email_sent}</td>
                      <td>{ elapsedTime(user.verification_date) }</td>
                    </tr>
            }
            {!user.emails.is_verify && user.status !== 0 &&
                    <tr>
                      <td colSpan='2'>
                        <a className='btn btn-warning btn-xs pull-left' onClick={resendInvitation}>{ text.resend_invitation }</a>
                      </td>
                    </tr>
            }
            {user.status !== 0 &&
                    <tr>
                      <td>{ text.password_last_changed}</td>
                      <td>{elapsedTime(user.password_changes.password_last_change_date)}</td>
                    </tr>
            }
            {user.status !== 0 && !isPasswordChanged(user) &&
                    <tr >
                      <td>{text.new_password_requested}</td>
                      <td >{elapsedTime(user.password_changes.password_change_date)}</td>
                    </tr>
            }
            { user.status !== 0 && checkPermission(loggedUser, user) && isPasswordChanged(user) &&
                    <tr >
                      <td className='warning' colSpan='2' >
                        <a className='btn btn-warning btn-xs pull-left'
                          onClick={handleResetPwd}>{ `${loading ? 'Sending' : 'Resend reset password'}`}</a>
                      </td>
                    </tr>
            }
            { user.status !== 0 && checkPermission(loggedUser, user) && !isPasswordChanged(user) &&
                    <tr >
                      <td className='warning' colSpan='2' >
                        <a className='btn btn-warning btn-xs pull-left'
                          onClick={handleResetPwd}>{ `${loading ? 'Sending' : 'Reset password'}`}</a>
                      </td>
                    </tr>
            }
            <tr>
              <td>{text.status}</td>
              <td>{getStatusName(user.status)}
                <ReactTooltip place='top' type='dark' effect='float'/>
              </td>

            </tr>
          </tbody>

        </table>
      );
    }
}
const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.user,
    loading: state.teamReducer.loading
  };
};

export default connect(mapStateToProps, null)(UserDetailTable);
