import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import { TableHeaderColumn } from 'react-bootstrap-table';
import ReactTooltip from 'react-tooltip';
import {Link} from 'react-router-dom';
import ReactDOM from 'react-dom';

import FSComponent from 'components/FSComponent';
import FSToolbar from 'components/Toolbar';
import Checkbox from 'components/Checkbox';
import FSTable from 'components/ReactBootstrapTable';
import { FSContextMenu, FSMenuItem } from 'components/ContextMenu';
import filesActions from '../actions';
import componentActions from 'components/actions';
import * as FilesUtils from 'utils/files';
import {pluralAppend} from 'utils/utils';
import {elapsedTime, sortObjByTime} from 'utils/DateTime';
import {history} from 'AppRoute';
import NewFolderModal from './NewFolderModal';
import FileDetailPanel from './FileDetailPanel';
import DeleteFolderModal from './DeleteFolderModal';
import RenameModal from './RenameModal';
import Dropzone from './Dropzone';

class FilesTable extends FSComponent {

  static propTypes = {
    toggleTabPanel: PropTypes.func,
    tabPanel: PropTypes.object,
    files: PropTypes.array,
    path: PropTypes.string,
    filesActions: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      files: this.props.files,
      selectedRow: {}
    };
    this.reversedSort = false;
    this.sortName = 'location';
  }

  componentWillMount() {
  }

  componentDidMount() {
    console.log(this.reversedSort, this.sortName);
    if (this.refs.filesTable) {
      this.refs.filesTable.handleSort('desc', 'location');
    }
  }

  componentDidUpdate() {
    if (this.refs.filesTable) {
      const order = !this.reversedSort ? 'desc' : 'asc';
      this.refs.filesTable.handleSort(order, this.sortName);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.files, this.state.files)) {
      this.setState({files: nextProps.files});
      if (this.props.path === nextProps.path && this.state.selectedRow.id) {
        const selectedRowId = this.state.selectedRow.id;
        this.setState({selectedRow: {}}, () => {
          const selectedRowNode = document.getElementById(selectedRowId);
          if (selectedRowNode) {
            selectedRowNode.click();
          }
        });
      }
    }
  }

  getFileIcon = (location) => {
    const extension = FilesUtils.getExtension(location.name);
    return FilesUtils.getIconForMineType(extension, location.is_dir, location.name);
  }

  sort = (a, b, order, sortField) => {
    return FilesUtils.fsSort(a, b, sortField, this.reversedSort);
  }

  sortDateTime = (a, b, order, sortField) => {
    return sortObjByTime(a, b, 'changes.file_created_time', this.reversedSort);
  }

  onSortChange = (sortName, sortOrder) => {
    this.reversedSort = sortOrder === 'desc' ? false : true;
    this.sortName = sortName;
  }

  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({selectedRow: row});
      if (this.props.tabPanel.expandPanel) {
        this.showDetailPanel(true, row);
      }
    } else {
      this.setState({selectedRow: {}});
      if (this.props.tabPanel.expandPanel) {
        this.showDetailPanel(false);
      }
    }
  }

  customCheckboxComponent = (properties) => {
    const { rowIndex, onChange } = properties; // other props: type, checked, disabled, onChange
    /*
    * If rowIndex is 'Header', means this rendering is for header selection column.
    */
    if (rowIndex === 'Header') {
      return <span className='checkbox'>
        <span className='icons'>
          <span className='first-icon icon-checkbox-unchecked'/>
          <span className='second-icon icon-checkbox-checked'/>
        </span>
        <input type='checkbox'/>
      </span>;
    } else {
      return (
        <Checkbox {...properties} onClick={e => { onChange(e, rowIndex);}}/>
      );
    }
  }

  handleClick = (e, data) => {
    console.log(data);
  }

  openFile = (file) => {
    if (file.location.is_dir) {
      return history.location.pathname + '/' + encodeURIComponent(file.location.name);
    }
    return '';
  }

  renderFileIconCol = (location, file) => {
    file.icon = this.getFileIcon(file.location);
    return <a><span className={file.icon}/></a>;
  }

  renderFileNameCol = (location, file) => {
    return (
      <div>
        <Link tabIndex='-1' to={this.openFile(file)} title={location.name} className='file-name'>
          { file.location.name }
        </Link>
        {!location.is_dir &&
        <span className='modified'>{ file.content.size.origin }, modified { file.changes.modified_time }</span>
        }
        {file.location.is_dir &&
        <span>
          <span className='folder-items'>
            {file.content.child_count === 0 ? 'Empty' : file.content.child_count + ' item' + pluralAppend(file.content.child_count)}
          </span>
          <span className='modified'>Modified {file.changes.modified_time}</span>
        </span>
        }
      </div>
    );
  }

  renderSharedToCol = (cell, row) => {
    return <Link to=''>
      {!row.location.is_dir ? cell.total_recipient + ' ' + this.text.recipient + pluralAppend(cell.total_recipient) : ''}
    </Link>;
  }

  renderCreatedCol = (cell, row) => {
    return `<span>${elapsedTime(row.changes.file_created_time)}</span>`;
  }

  renderModifiedTimeCol = (cell, row) => {
    return `<span>${elapsedTime(cell.file_modified_time)}</span>`;
  }

  renderViewsCol = (cell, row) => {
    return <span>{!row.location.is_dir ? 10 : ''}</span>;
  }

  toggleDetailPanel = () => {
    const expand = !this.props.tabPanel.expandPanel;
    this.showDetailPanel(expand);
  }

  showDetailPanel = (expand, row) => {
    if (!expand) {
      this.props.toggleTabPanel({});
    } else {
      const file = row || this.state.selectedRow;
      let tabContents = [];
      let tabs = [this.text.details];
      tabContents.push(<FileDetailPanel file={file}/>);
      let tabPanel = {
        tabs: tabs,
        tabContents: tabContents,
        expandPanel: expand
      };
      this.props.toggleTabPanel({...tabPanel});
    }
  };

  openNewFolderModal = (event) => {
    event.preventDefault();
    this.props.toggleModal({
      modalName: NewFolderModal.MODAL_NAME,
      modalProps: {
        files: this.props.files,
        path: this.props.path
      },
      ActiveModal: NewFolderModal
    });
  }

  openDeleteFolderModal = (event) => {
    event.preventDefault();
    this.props.toggleModal({
      modalName: DeleteFolderModal.MODAL_NAME,
      modalProps: {
        directory: this.state.selectedRow,
        path: this.props.path
      },
      ActiveModal: DeleteFolderModal
    });
  }

  openRenameModal = (event) => {
    event.preventDefault();
    this.props.toggleModal({
      modalName: RenameModal.MODAL_NAME,
      modalProps: {
        file: this.state.selectedRow,
        path: this.props.path
      },
      ActiveModal: RenameModal
    });
  }

  trClassFormat = (row, rowIndex) => {
    return !row.sharing.total_recipient && !row.location.is_dir && row.ownership === 1 ? 'inactive warning-bar' : '';
  }

  handleSearch = (keyword) => {
    this.props.filesActions.fetchFiles({
      path: FilesUtils.normalizePath(this.props.path),
      keyword: keyword
    });
  }

  resetSearch = () => {
    this.props.filesActions.fetchFiles({path: FilesUtils.normalizePath(this.props.path)});
  }

  render() {
    const {tabPanel} = this.props;
    const {files, selectedRow} = this.state;
    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      customComponent: this.customCheckboxComponent,
      selected: [selectedRow.id],
      onSelect: this.handleRowSelect
    };
    let listFiles;
    listFiles = files.filter((file) => {
      return file.location.name.length && file.location.name !== 'FileString Received Files';
    });
    const toolbarButtons = [
      {
        className: 'create',
        icon: 'icon-add-folder',
        tooltip: 'Create Folder',
        func: this.openNewFolderModal,
        disabled: false
      },
      {
        className: 'view',
        icon: 'icon-view',
        tooltip: 'Open',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'add-user',
        icon: 'icon-add-user',
        tooltip: 'String...',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'shareable',
        icon: 'icon-reshare',
        tooltip: 'Copy Shareable Link',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'edit',
        icon: 'icon-pencil',
        tooltip: 'Rename',
        func: this.openRenameModal,
        disabled: selectedRow.id ? false : true
      },
      {
        className: 'move-to',
        icon: 'icon-move-to',
        tooltip: 'Move To',
        func: undefined,
        disabled: selectedRow.id ? false : true
      },
      {
        className: 'download',
        icon: 'icon-download',
        tooltip: 'Download',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'save-to-cloud',
        icon: 'icon-cloud-download',
        tooltip: 'Save To Cloud',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'view-recipients',
        icon: 'icon-users',
        tooltip: 'View Recipients',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'revoke',
        icon: 'icon-revoke',
        tooltip: 'Revoke Access',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'chart',
        icon: 'icon-chart',
        tooltip: 'File Access Reports',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'update',
        icon: 'icon-push-update',
        tooltip: 'Update',
        func: undefined,
        disabled: selectedRow.id && !selectedRow.location.is_dir ? false : true
      },
      {
        className: 'delete',
        icon: 'icon-trash',
        tooltip: 'Delete',
        func: selectedRow.id && selectedRow.location.is_dir ? this.openDeleteFolderModal : undefined,
        disabled: selectedRow.id ? false : true
      }
    ];
    const searchOptions = {placeholder: 'Search all folders', searchFunc: this.handleSearch, resetSearchFunc: this.resetSearch};
    const filterOptions = {};
    const details = {expandPanel: tabPanel.expandPanel, onClick: this.toggleDetailPanel};
    return (
      <div style={{'height': '100%'}}>
        <FSToolbar buttons={toolbarButtons} search={searchOptions} filter={filterOptions} details={details} record={selectedRow}/>
        {listFiles.length
          ? <div className='list-view'>
            <FSContextMenu id='list-file' className='dropdown context-menu'>
              <FSMenuItem data={{item: 'Edit'}} onClick={this.handleClick}><a href='' className='icon-pencil'>Edit</a></FSMenuItem>
              <FSMenuItem data={{item: 'Edit'}} onClick={this.handleClick} attributes={{className: 'danger'}}><a href='' className='icon-locked'>Reset Password</a></FSMenuItem>
              <FSMenuItem data={{item: 'Edit'}} onClick={this.handleClick} attributes={{className: 'danger'}}><a href='' className='icon-trash' >Delete</a></FSMenuItem>
              <FSMenuItem data={{item: 'Edit'}} onClick={this.handleClick} attributes={{className: 'danger'}}><a href='' className='icon-cancel' /></FSMenuItem>
            </FSContextMenu>
            <div style={{'height': '100%'}}>
              <FSTable data={listFiles} hover={true} bordered={false}
                tableBodyClass='table filter-all-files list-view my-files'
                tableHeaderClass='table filter-all-files list-view my-files'
                selectRow={selectRow}
                contextMenuId='list-file'
                options={{sortIndicator: false, onSortChange: this.onSortChange.bind(this)}}
                ref='filesTable'
                trClassName={this.trClassFormat}
              >
                <TableHeaderColumn
                  dataField='id'
                  isKey={true}
                  dataFormat={this.renderFileIconCol}
                  dataSort={true} sortFunc={(a, b, order) => this.sort(a, b, order, 'icon')}
                  dataAlign='center' headerAlign='center'>
                  {this.text.type}
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='location'
                  columnClassName='file-info'
                  className='file-info'
                  dataFormat={this.renderFileNameCol}
                  dataSort={true}
                  sortFunc={(a, b, order) => this.sort(a, b, order, 'location.name')}>
                  {this.text.name}
                </TableHeaderColumn>
                <TableHeaderColumn dataField='sharing'
                  dataFormat={this.renderSharedToCol}
                >{this.text.shared_to}</TableHeaderColumn>
                <TableHeaderColumn dataField='change'
                  dataFormat={this.renderCreatedCol}
                  dataSort={true}
                  sortFunc={(a, b, order) => this.sortDateTime(a, b, order, 'changes.file_created_time')}>
                  {this.text.created}
                </TableHeaderColumn>
                <TableHeaderColumn dataField='changes'
                  dataFormat={this.renderModifiedTimeCol}
                  dataSort={true}
                  sortFunc={(a, b, order) => this.sortDateTime(a, b, order, 'changes.file_modified_time')}>
                  {this.text.last_updated}
                </TableHeaderColumn>
                <TableHeaderColumn dataField='sharing'
                  dataFormat={this.renderViewsCol}
                  dataAlign='center' headerAlign='center'>
                  {this.text.views}
                </TableHeaderColumn>
              </FSTable>
            </div>
          </div>
          : <Dropzone/>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tabPanel: state.componentReducer.tabPanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleTabPanel: bindActionCreators(componentActions.toggleTabPanel, dispatch),
    toggleModal: bindActionCreators(componentActions.toggleModal, dispatch),
    filesActions: bindActionCreators(filesActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesTable);
