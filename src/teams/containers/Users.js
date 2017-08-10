import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { TableHeaderColumn } from 'react-bootstrap-table';
import ReactTooltip from 'react-tooltip';
import {debounce} from 'lodash';

import Checkbox from 'components/Checkbox';
import componentActions from 'components/actions';
import FSTable from 'components/ReactBootstrapTable';
import { FSContextMenu, FSMenuItem } from 'components/ContextMenu';
import teamActions from '../actions';
import {elapsedTime} from 'utils/DateTime';
import {filterArrayObj} from 'utils/utils';
import {getUserTypeName, getStatusName, isPasswordChanged, checkPermission, MT_ADMIN} from 'utils/teams';
import UserDetailTable from '../components/UserDetailTable';
import FileStats from '../components/FileStats';
import AddUser from '../components/AddUser';
import EditUser from '../components/EditUser';
import DeleteUser from '../components/DeleteUser';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: {},
      query: '',
      members: props.members
    };
  }

  componentWillMount() {
    this.props.updateBreadcrumbs([{name: this.props.text.title, path: null}]);
    if (this.props.user && this.props.user.team) {
      this.props.fetchTeamMember({team_id: this.props.user.team.id});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user) {
      const { user } = nextProps;
      if (user && user.team) { // Wait authReducer
        this.props.fetchTeamMember({team_id: user.team.id});
      }
    }
    if (nextProps.needRefresh) {
      this.props.fetchTeamMember({team_id: this.props.user.team.id});
    }
    if (nextProps.members) {
      this.setState({members: nextProps.members});
    }
  }

  componentWillUnmount() {
    this.props.toggleTabPanel({expandPanel: false});
  }

  formatRenderUserCol = (cell, row) => {
    return `<div>
      <strong>${row.first_name} ${row.last_name}</strong></div>
      <strong>${cell.primary}</strong></div>`;
  }
  handleClick = (e, data) => {
    let menu = data;
    switch (menu.item) {
      case 'EDIT':
        this.showEditUserModal();
        break;
      case 'RESET':
        this.resetPassword();
        break;
      case 'DELETE':
        this.deleteUser();
        break;
      default:
        break;
    }
  }

  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({row}, () => {
        if (this.props.tabPanel.expandPanel) {
          this.props.toggleTabPanel({...this.setTabPanelData(true)});
        }
      });
    } else {
      this.setState({row: {}});
      this.props.toggleTabPanel({});
    }
  }

  customCheckboxComponent = (props) => {
    const { type, checked, disabled, onChange, rowIndex } = props;
    /*
    * If rowIndex is 'Header', means this rendering is for header selection column.
    */
    if (rowIndex === 'Header') {
      return (
        <div className='checkbox-personalized'>
          {/* <Checkbox {...props}/> */}
          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check' />
          </label>
        </div>);
    } else {
      return (

        <div className='checkbox-personalized'>
          <Checkbox {...props} id={ 'checkbox' + rowIndex } onClick={e => { onChange(e, rowIndex);}}/>

          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check' />
          </label>
        </div>);
    }
  }
  setTabPanelData = (expandPanel) => {
    const {row} = this.state;
    let tabContents = [];
    let tabs = [this.props.text.details];
    tabContents.push(<UserDetailTable user={row} handleResetPwd={this.resetPassword} />);
    if (row.status !== 0) {
      tabContents.push(<FileStats user={row} />);
      tabs.push(this.props.text.files);
    }
    let tabPanel = {
      tabs: tabs,
      tabContents: tabContents,
      expandPanel: expandPanel
    };
    return tabPanel;
  }
  toggleDetailPanel = () => {
    if (!this.props.tabPanel.expandPanel) {
      this.props.toggleTabPanel({...this.setTabPanelData(true)});
    } else {
      this.props.toggleTabPanel({});
    }
  };

  showAddUserModal = () => {
    this.props.toggleModal({modalName: AddUser.MODAL_NAME, modalProps: {}, ActiveModal: AddUser});
  };

  showEditUserModal = () => {
    this.props.toggleModal({
      modalName: EditUser.MODAL_NAME,
      modalProps: {
        member: this.state.row,
        allowEdit: checkPermission(this.props.user, this.state.row)
      },
      ActiveModal: EditUser});
  };

  deleteUser = () => {
    this.props.toggleModal({
      modalName: DeleteUser.MODAL_NAME,
      modalProps: {
        member: this.state.row,
        members: this.props.members
      },
      ActiveModal: DeleteUser
    });
  }

  onShowContextMenu = (e) => {
    const {row} = e.detail.data;
    this.setState({row});
  }

  setClassContextMenu = (menuName) => {
    const {user} = this.props;
    const {row} = this.state;
    if (!row.uid) {
      return '';
    }
    let className = '';
    switch (menuName) {
      case 'EDIT':
        className = !row.uid || (!checkPermission(user, row) && row.uid !== user.uid) ? 'disabled' : '';
        break;
      case 'RESET':
        className = !checkPermission(user, row) || row.status === 0 ? 'disabled' : '';
        break;
      case 'DELETE':
        className = !checkPermission(user, row) ? 'danger disabled' : 'danger';
        break;
      default:
        break;
    }
    return className;
  }

  onKeywordChange = (value) => {
    this.setState({query: value});
    debounce(() => {
      let members = filterArrayObj(this.props.members, this.state.query);
      this.setState({members});
    }, 500)();
  }

  render() {
    const { text, expandPanel } = this.props;
    const { members } = this.state;
    // if (!members.length) {
    //   return null;
    // }
    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      customComponent: this.customCheckboxComponent,
      selected: [this.state.row.uid],
      onSelect: this.handleRowSelect
    };
    return (
      <div className='manage-users'>
        <div className='tab-content'>
          <FSContextMenu id='admin_console'
            onShow={this.onShowContextMenu}
            className='dropdown context-menu'>
            <FSMenuItem data={{item: 'EDIT'}}
              attributes={{
                className: this.setClassContextMenu('EDIT')
              }}
              onClick={this.handleClick}>
              <a href='' className='icon-pencil'>Edit</a>
            </FSMenuItem>
            <FSMenuItem data={{item: 'RESET'}}
              disabled={!checkPermission(this.props.user, this.state.row)}
              attributes={{
                className: this.setClassContextMenu('RESET')
              }}
              onClick={this.handleClick} ><a href='' className='icon-locked'>Reset Password</a></FSMenuItem>
            <FSMenuItem data={{item: 'DELETE'}}
              attributes={{
                className: this.setClassContextMenu('DELETE')
              }}
              onClick={this.handleClick} ><a href='' className='icon-trash' >Delete</a></FSMenuItem>
            <FSMenuItem data={{item: 'Cancel'}} onClick={this.handleClick} ><a href='' className='icon-cancel' /></FSMenuItem>
          </FSContextMenu>
          <div className='tab-pane fade in active'>
            <header>
              <div className='toolbar pull-left'>
                <a href='#'
                  data-tip={text.addNewUser}
                  onClick={this.showAddUserModal}
                ><span className='icon-add-user'/></a>
                <a
                  href='#'
                  data-tip={text.editUser}
                  onClick={this.showEditUserModal}
                  className={`${!this.state.row.uid || (!checkPermission(this.props.user, this.state.row) && this.props.user.team.member_type <= MT_ADMIN) ? 'disabled' : ''}`}
                >
                  <span className='icon-pencil'/></a>
                <a href='#'
                  data-tip={text.resetPassword}
                  onClick={this.resetPassword}
                  className={`${!checkPermission(this.props.user, this.state.row) ? 'disabled' : ''}`}
                >
                  <span className='icon-locked'/></a>
                <a href='#'
                  data-tip={text.deleteUser}
                  className={`${!checkPermission(this.props.user, this.state.row) ? 'disabled' : ''}`}
                  onClick={this.deleteUser}
                ><span className='icon-trash'/></a>
                <ReactTooltip place='top' type='dark' effect='float'/>
              </div>
              <div className='input-group input-group-rounded pull-left' role='search'>
                <span className='input-group-btn'>
                  <button type='button' className='btn'><span className='icon-search' /></button>
                </span>
                {this.state.query &&
                  <a href='javascript:void(0)' className='input-icon ng-scope' onClick={() => {this.onKeywordChange('');}}>×</a>
                }
                <input name='keyword' type='text'
                  className='form-control no-clear-button'
                  value={this.state.query}
                  placeholder='Search' onChange={(e) => {this.onKeywordChange(e.target.value);}}/>
              </div>
              <div className='toolbar pull-right no-border'>
                <a data-tip={text.detail} className={`${!this.state.row.uid ? 'disabled' : ''}`} disabled={true} onClick={this.toggleDetailPanel}><span className='icon-info' /></a>
              </div>
            </header>
            <FSTable data={members} hover={true} bordered={false}
              tableBodyClass='table internal-users'
              tableHeaderClass='table internal-users'
              selectRow={selectRow}
              contextMenuId='admin_console'
            >
              <TableHeaderColumn
                dataField='uid'
                isKey={true}
                dataFormat={(cell, row) => {
                  return <span className='avatar sm'>{row.first_name[0]}</span>;}}>
                  &nbsp;
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='emails'
                dataFormat={this.formatRenderUserCol} >
                User
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='job_title'>Job Title</TableHeaderColumn>
              <TableHeaderColumn
                dataField='team'
                dataFormat={(cell, row) => getUserTypeName(cell.member_type)
                }>Role</TableHeaderColumn>
              <TableHeaderColumn
                dataField='created_date'
                dataFormat={(cell, row) => {
                  return elapsedTime(cell);
                }}>
                  Created
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='stats'
                dataFormat={(cell,row) => cell.sent}
              >
                Sent
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='stats'
                dataFormat={(cell,row) => cell.reshared}
              >
                Re-shared
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='stats'
                dataFormat={(cell,row) => cell.received}
              >Received</TableHeaderColumn>
              <TableHeaderColumn
                dataField='stats'
                dataFormat={(cell,row) => cell.recipents}
              >
                Recipents
              </TableHeaderColumn>
              <TableHeaderColumn dataField='status'
                dataFormat={(cell,row) => getStatusName(cell)}
              >Status</TableHeaderColumn>
            </FSTable>
          </div>
        </div>
      </div>
    );
  }
}
Users.propTypes = {
  updateBreadcrumbs: PropTypes.func,
  text: PropTypes.object,
  fetchTeamMember: PropTypes.func,
  user: PropTypes.object,
  members: PropTypes.array,
  expandPanel: PropTypes.bool,
  toggleTabPanel: PropTypes.func,
  rowIndex: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  type: PropTypes.string,
  toggleModal: PropTypes.func,
  needRefresh: PropTypes.bool,
  tabPanel: PropTypes.object
};
Users.defaultProps = {
  text: {
    title: 'Users',
    addNewUser: 'Add New User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    resetPassword: 'Reset Password',
    details: 'Details',
    files: 'Files'
  }
};
const mapStateToProps = state => {
  return {
    breadcrumbs: state.componentReducer.breadcrumbs,
    user: state.authReducer.user,
    members: state.teamReducer.members,
    needRefresh: state.teamReducer.needRefresh,
    tabPanel: state.componentReducer.tabPanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBreadcrumbs: bindActionCreators(componentActions.updateBreadcrumbs, dispatch),
    toggleModal: bindActionCreators(componentActions.toggleModal, dispatch),
    toggleTabPanel: bindActionCreators(componentActions.toggleTabPanel, dispatch),
    fetchTeamMember: bindActionCreators(teamActions.fetchTeamMember, dispatch)

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
