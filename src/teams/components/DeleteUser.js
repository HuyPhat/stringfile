import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Typeahead} from 'react-bootstrap-typeahead';

import FSComponent from 'components/FSComponent';
import actionsFunc from 'components/actions';
import RadioButton from 'components/Radio';
import teamActions from '../actions';
import {MT_ADMIN} from 'utils/teams';

const TEXT = {
  deleteMsg: (primaryEmail) => `${primaryEmail} will be permantly deleted from FileString Inc.`,
  assignMsg: (number, name) => `What do you want to do with ${number} file owned by`,
  delete_these_files: 'Delete these files',
  reassign_these_files: 'Reassign these files to the following user'
};
const MODAL_NAME = 'ADD_USER';
class DeleteUser extends FSComponent {
  static MODAL_NAME = MODAL_NAME
  constructor(props) {
    super(props, TEXT);
    this.state = {
      deleteActions: {

      },
      step: 1,
      messageStep2: '',
      deleteAll: false
    };
  }

  componentWillMount() {
    if (this.props.member && this.props.member.stats.sent === 0) {
      this.setState({step: 2, deleteAll: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading) { // Action completed
      this.props.toggleModal({ modalName: '', ActiveModal: null });
    }
  }

  assignToMe = (event) => {
    event.preventDefault();
    const {deleteActions} = this.state;
    deleteActions.recepient = this.props.user;
    this.setState({deleteActions});
  }

  onChangeTypehead = (option) => {
    const {deleteActions} = this.state;
    deleteActions.recepient = option[0];
    this.setState({deleteActions});
  }

  onDelete = () => {
    const {step, deleteAll, deleteActions} = this.state;
    const {member, user} = this.props;
    if (step === 1) {
      let messageStep2 = '';
      if (member.stats.sent > 0) {
        if (deleteAll) {
          if (member.stats.sent === 1) {
            messageStep2 = `1 file owned by ${member.first_name} ${member.last_name} will be deleted.`;
          } else {
            messageStep2 = `${member.stats.sent} files owned by ${member.first_name} ${member.last_name} will be deleted.`;
          }
          deleteActions.recepient = null;
        } else {
          if (!deleteActions.recepient) {
            deleteActions.recepient = this.props.user;
          }
          let assignedName = '';
          if (deleteActions.recepient.emails.primary === this.props.user.emails.primary) {
            assignedName = 'you';
          } else {
            assignedName = deleteActions.recepient.emails.primary;
          }
          if (member.stats.sent === 1) {
            messageStep2 = `1 file owned by ${member.first_name} ${member.last_name} will be reassigned to ${assignedName}.`;
          } else {
            messageStep2 = `${member.stats.sent} files owned by ${member.first_name} ${member.last_name} will be reassigned to ${assignedName}.`;
          }
        }
      }
      this.setState({messageStep2, deleteActions, step: 2});
    } else {
      let new_owner;
      if (!deleteAll) {
        new_owner = deleteActions.recepient.uid;
      }
      if (!new_owner) {
        return;
      }
      this.props.deleteMember({uid: user.uid, team_id: user.team.id, identity: member.uid, new_owner: new_owner, change: member.status !== 0 ? -2 : -1});
    }
  }

  render() {
    const { modalName, member, loading, members } = this.props;
    const text = this.text;
    const { step, messageStep2 } = this.state;
    let displayName = [member.first_name, member.last_name].join(' ').trim();
    let primaryEmail = '';
    if (displayName.length) {
      primaryEmail = `${displayName} (${member.emails.primary})`;
    } else {
      primaryEmail = member.emails.primary;
    }
    const filterByCallback = (option, txt) => {
      return (
        option.team.member_type >= MT_ADMIN &&
          option.uid !== member.uid && (
          option.first_name.toLowerCase().indexOf(txt.toLowerCase()) !== -1 ||
          option.last_name.toLowerCase().indexOf(txt.toLowerCase()) !== -1 ||
          option.emails.primary.toLowerCase().indexOf(txt.toLowerCase()) !== -1
        )
      );
    };
    return (
      <Modal
        show={modalName === MODAL_NAME}
        onHide={() =>
          this.props.toggleModal({ modalName: '', ActiveModal: null })}
        bsSize='large'
        className='delete-team-member'
        backdrop='static' keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title >
            Delete {displayName ? displayName : primaryEmail}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${loading ? 'disabled' : ''}`} >
          <div className='mask' />
          <div className='messages'/>
          <label className='title'>{text.deleteMsg(primaryEmail)}</label>
          {step === 1 &&
          <div className='form-group member-delete-form'>
            <form name='assignForm'>
              <label className='desc'>{text.assignMsg(member.stats.sent)} <strong>{displayName}</strong></label>
              <div className='form-group'>
                <RadioButton className='delete-action' onClick={() => {this.setState({deleteAll: true});}} checked={this.state.deleteAll} labelText={text.delete_these_files} />
              </div>
              <div className='form-group'>
                <RadioButton className='delete-action' onClick={() => {this.setState({deleteAll: false});}} checked={!this.state.deleteAll} labelText={text.reassign_these_files}/>
              </div>
              <div className='form-group'>
                <div className={`recipient-list ${this.state.deleteAll ? 'disabled' : '' }`} >
                  <Typeahead options={members} disabled={this.state.deleteAll} labelKey={option => `${option.first_name} ${option.last_name} (${option.emails.primary})`}
                    filterBy={filterByCallback }
                    selected={[this.state.deleteActions.recepient]}
                    onChange={this.onChangeTypehead}
                  />
                  <a href='#' onClick={this.assignToMe} className='pull-right' >Reassign to me</a>
                  <span className='help-block'>Selected user must have permission to string file.</span>
                </div>
              </div>
            </form>
          </div>
          }
          {step === 2 &&
            <div className='form-group member-delete-form'>
              {messageStep2}
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          {(step === 1 || !member.stats.sent) &&
          <button className='btn btn-default btn-block' onClick={() =>
            this.props.toggleModal({ modalName: '', ActiveModal: null })}>Cancel</button>
          }
          {step === 2 && member.stats.sent > 0 &&
          <button className='btn btn-default btn-block' onClick={() => {this.setState({step: 1});}} >Back</button>
          }
          <button className='btn btn-danger btn-block' onClick={this.onDelete}>Delete</button>
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
  toggleModal: bindActionCreators(actionsFunc.toggleModal, dispatch),
  deleteMember: bindActionCreators(teamActions.deleteMember, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);
