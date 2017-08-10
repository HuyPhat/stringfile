import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';

import { capitalize } from 'utils/stringFunc';
import { validateEmail } from 'utils/utils';
import { MT_ADMIN, MT_SENDER, MT_RESHAEABLE_RECEIVER, MT_VIEW_ONLY_RECEIVER, getUserTypeName } from 'utils/teams';
import actionsFunc from 'components/actions';
import FSComponent from 'components/FSComponent';
import TextInput from 'components/TextInput';

import teamActions from '../actions';

const { toggleModal } = actionsFunc;
const MODAL_NAME = 'ADD_USER';
const TEXT = {
  add_new_user: 'Add New User',
  errorRequireMsg: (name) => `Please input your ${name}`,
  errorInValidMsg: (name) => `Please input valid ${name}`
};
class AddUser extends FSComponent {
  static MODAL_NAME = MODAL_NAME

  constructor(props) {
    super(props, TEXT);
    this.state = {
      user: {
        member_type: MT_VIEW_ONLY_RECEIVER,
        first_name: '',
        last_name: '',
        email: ''
      },
      showError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.error && nextProps.loading !== this.props.loading && this.props.loading) { // Action completed
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
    const {user} = this.state;
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
      this.props.addTeamMember({...user, team_id: this.props.user.team.id, user_id: this.props.user.uid});
    } else {
      this.setState({showError: true});
    }
  }
  setMemberType = (member_type) => {
    let {user} = this.state;
    user.member_type = member_type;
    this.setState(user);
  }
  render() {
    const { modalName, loading } = this.props;
    const text = this.text;
    const {user, showError} = this.state;
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
            {text.add_new_user}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${loading ? 'disabled' : ''}`}>
          <div className='mask' />
          <div className='messages'/>
          <form name='addTeamMember' noValidate onSubmit={this.onSubmit}>
            <div className='form-group  no-border'>
              <label>{text.first_name}</label>
              <TextInput
                className='form-control'
                name='first_name'
                type='text'
                onChange={this.setTextInputValue}
                errorRequireMsg={text.errorRequireMsg('first name')}
                showError={showError}
                required={true}
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
              />

              <label>{text.email_address}</label>
              <TextInput
                className='form-control'
                name='email'
                type='email'
                onChange={this.setTextInputValue}
                errorRequireMsg={text.errorRequireMsg('email address')}
                errorInValidMsg={text.errorInValidMsg('email address')}
                showError={showError}
                required={true}
                validateFunc={validateEmail}
              />

              <label>{text.job_title}</label>
              <TextInput className='form-control'
                name='job_title'
                value={this.state.user.job_title}
                onChange={this.setTextInputValue}
              />

              <label>{text.role}</label>
              <Dropdown id='select_member_type' componentClass='div'
                className='select btn-group select select-picker dropdown'

              >
                <Dropdown.Toggle>
                  {getUserTypeName(user.member_type)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem onClick={() => {this.setMemberType(MT_ADMIN);}}>Administrator</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_SENDER);}}>Sender</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_RESHAEABLE_RECEIVER);}}>Re-Sharer</MenuItem>
                  <MenuItem onClick={() => {this.setMemberType(MT_VIEW_ONLY_RECEIVER);}}>Viewer</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <button className='hide' />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-default btn-block' onClick={() =>
            this.props.toggleModal({ modalName: '', ActiveModal: null })}>Cancel</button>
          <button className='btn btn-primary btn-block' onClick={this.onSubmit}>Invite</button>
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
  addTeamMember: bindActionCreators(teamActions.addTeamMember, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
