import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';

import { capitalize } from 'utils/stringFunc';
import { validateEmail } from 'utils/utils';
import { elapsedTime } from 'utils/DateTime';
import { MT_ADMIN, MT_SENDER, MT_RESHAEABLE_RECEIVER, MT_VIEW_ONLY_RECEIVER, getUserTypeName } from 'utils/teams';
import actionsFunc from 'components/actions';
import FSComponent from 'components/FSComponent';
import TextInput from 'components/TextInput';

import teamActions from '../actions';

const { toggleModal } = actionsFunc;
const MODAL_NAME = 'EditUser';
const TEXT = {
  edit_user: 'Edit User',
  errorRequireMsg: (name) => `Please input your ${name}`,
  errorInValidMsg: (name) => `Please input valid ${name}`
};
class EditUser extends FSComponent {
  static MODAL_NAME = MODAL_NAME

  constructor(props) {
    super(props, TEXT);
    this.state = {
      user: this.props.member,
      showError: false
    };
    this.state.user.member_type = this.props.member.team.member_type;
    this.state.user.email = this.props.member.emails.primary;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading) { // Action completed
      this.props.toggleModal({ modalName: '', ActiveModal: null });
    }
  }

  setTextInputValue = (name, value) => {
    const user = this.state.user;
    user[name] = value;
    return this.setState({ user });
  };

  onSubmit = (event) => {
    event.preventDefault();
    let {first_name, last_name, email, job_title, member_type} = this.state.user;
    let user = {
      first_name, last_name, email, job_title, member_type
    };
    let isValid = true;
    for (let i in user) {
      if (user.hasOwnProperty(i)) {
        switch (i) {
          case 'first_name':
          case 'last_name':
            if (user[i] === '') {
              isValid = false;
            }
            break;
          case 'email':
            if (!validateEmail(user[i])) {
              isValid = false;
            }
            break;
          default:
            break;
        }
      }
    }
    if (isValid) {
      if (user.email !== this.state.user.emails.primary) {
        user.email_old = this.state.user.emails.primary;
      }
      this.props.editTeamMember({...user, team_id: this.props.member.team.id, user_id: this.props.member.uid});
    } else {
      this.setState({showError: true});
    }
  }
  resetPassword = (event) => {
    this.props.requestChangePassword({
      uid: this.props.user.uid,
      team_id: this.props.member.team.id,
      member_id: this.props.member.uid}
    );
  };
  resendVerificationEmail = () => {
    this.props.resendVerification({
      email: this.state.user.emails.primary
    });
  };
  setMemberType = (member_type) => {
    let {user} = this.state;
    user.member_type = member_type;
    this.setState(user);
  }
  resendInvitation = () => {
    this.props.resendInvitation({
      uid: this.props.user.uid,
      team_id: this.props.member.team.id,
      identity: this.state.user.emails.primary
    });
  }
  render() {
    const { modalName, loading, allowEdit } = this.props;
    const text = this.text;
    const {user, showError} = this.state;
    const member_type = this.props.user.team.member_type;
    return (
      <Modal
        show={modalName === MODAL_NAME}
        onHide={() =>
          this.props.toggleModal({ modalName: '', ActiveModal: null })}
        bsSize='sm'
        backdrop='static' keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title >
            {text.edit_user}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${loading ? 'disabled' : ''}`}>
          <span className='avatar lg'>{user.first_name[0]}</span>
          <div className='mask' />
          <div className='messages'/>
          <form name='addTeamMember' noValidate onSubmit={this.onSubmit}>
            <div className='form-group '>
              <label>{text.first_name}</label>
              <TextInput
                className='form-control'
                name='first_name'
                type='text'
                onChange={this.setTextInputValue}
                errorRequireMsg={text.errorRequireMsg('first name')}
                showError={showError}
                required={true}
                value={user.first_name}
              />

              <label>{text.last_name}</label>
              <TextInput
                className='form-control'
                name='last_name'
                type='text'
                onChange={this.setTextInputValue}
                errorRequireMsg={text.errorRequireMsg('last name')}
                showError={showError}
                required={true}
                value={user.last_name}
              />

              <label>{text.job_title}</label>
              <TextInput className='form-control'
                name='job_title'
                onChange={this.setTextInputValue}
                value={user.job_title}
              />
              <label>{text.role}</label>
              <Dropdown id='select_member_type' componentClass='div'
                className='select btn-group select select-picker dropdown'
                disabled={user.team.member_type >= member_type}
              >
                <Dropdown.Toggle className={`${user.team.member_type >= member_type ? 'disabled' : ''}`}>
                  {getUserTypeName(user.member_type)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem onClick={() => {this.setMemberType(MT_ADMIN);}}>Administrator</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_SENDER);}}>Sender</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_RESHAEABLE_RECEIVER);}}>Re-Sharer</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_VIEW_ONLY_RECEIVER);}}>Viewer</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
              <br/>
              <button className='btn btn-primary btn-xs'>Save</button>
            </div>
          </form>
          { user.team.member_type < member_type &&
          <form name='emailForm' className='form-group' onSubmit={this.onSubmit}>
            <label>{text.email_address}</label>
            <TextInput
              className='form-control'
              name='email'
              type='email'
              onChange={this.setTextInputValue}
              errorRequireMsg={text.errorRequireMsg('email address')}
              errorInValidMsg={text.errorInValidMsg('email address')}
              showError={true}
              required={true}
              validateFunc={validateEmail}
              value={user.email}
            />
            <br/>
            <button
              disabled={!validateEmail(user.email) || user.email === user.emails.primary ? 'disabled' : ''}
              className={`btn btn-primary btn-xs ${!validateEmail(user.email) || user.email === user.emails.primary ? 'disabled' : ''}`}>Save</button>
          </form>
          }
          { user.team.member_type >= member_type &&
            <p>{text.email_address}<br/><strong>{user.email}</strong></p>
          }
          {user.status !== 0 && user.emails.is_verify && user.team.member_type < member_type &&
            <div className='form-group' >
              <p>
                {text.password_last_changed}<br/>
                {elapsedTime(user.password_changes.password_last_change_date)}
              </p>
              <a className='btn btn-primary btn-xs' onClick={this.resetPassword}>Reset Password</a>
            </div>
          }
          {!user.emails.is_verify && user.status !== 0 &&
          <div className='form-group ac-magic' >
            <p>
              {text.verificaton_email_sent}<br/>
              <strong>{ elapsedTime(user.verification_date) }</strong>
            </p>
            <button className='btn btn-primary btn-xs' onClick={this.resendVerificationEmail}>{text.resend_vefification}</button>
          </div>
          }
          {!user.emails.is_verify && user.status === 0 &&
          <div className='form-group ac-magic' >
            <p>
              {text.invitation_sent}<br/>
              <strong>{ elapsedTime(user.invitation_sent_date) }</strong>
            </p>
            <button className='btn btn-primary btn-xs' onClick={this.resendInvitation}>{text.resend_vefification}</button>
          </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-default btn-block' onClick={() =>
            this.props.toggleModal({ modalName: '', ActiveModal: null })}>Cancel</button>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
    loading: state.teamReducer.loading,
    error: state.teamReducer.error
  };
};

const mapDispatchToProps = dispatch => ({
  toggleModal: bindActionCreators(toggleModal, dispatch),
  editTeamMember: bindActionCreators(teamActions.editTeamMember, dispatch),
  requestChangePassword: bindActionCreators(teamActions.requestMemberChangePassword, dispatch),
  resendInvitation: bindActionCreators(teamActions.resendInvitation, dispatch),
  resendVerification: bindActionCreators(teamActions.resendVerification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
