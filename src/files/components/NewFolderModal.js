import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Modal} from 'react-bootstrap';
import Alert from 'components/Alert';
import actionsFunc from 'components/actions';
import fileActions from '../actions';
import {getIconForMineType, getExtension, normalizePath} from 'utils/files';

const {toggleModal} = actionsFunc;
const {createFolder} = fileActions;
const MODAL_NAME = 'NewFolder';

class NewFolderModal extends React.Component {
  static MODAL_NAME = MODAL_NAME;
  static defaultProps = {
    text: {
      title: 'New Folder',
      folder_input_label: 'Folder Name',
      cancel: 'Cancel',
      create: 'Create',
      folder_name_required: 'Folder name is required.',
      existed_folder: (folder_name) => `A folder named ${folder_name} already exists in this location. Please enter another name.`
    }
  };
static propTypes = {
  files: PropTypes.array,
  actions: PropTypes.object,
  modalType: PropTypes.string,
  modalName: PropTypes.string,
  path: PropTypes.string,
  text: PropTypes.object,
  loading: PropTypes.bool
};

constructor(props) {
  super(props);
  this.state = {
    errorMessage: null,
    folderName: this.getDefaultFolderName('New Folder')
  };
}

componentDidMount() {
  if (this.folderNameInput) {
    this.folderNameInput.focus();
  }
}

componentWillReceiveProps(nextProps) {
  if (!nextProps.loading) {
    this.closeModal();
  }
}

  findFolder = (folder_name) => {
    const {files} = this.props;
    let found = 0;
    for (let i = 0; i < files.length; i++) {
      let folder = files[i];
      if (!folder.location.is_dir) {
        continue;
      }
      if (folder.location.name === folder_name) {
        found++;
      }
    }
    return found;
  }

  getDefaultFolderName = (folderName) => {
    let isExisting = this.findFolder(folderName);
    let name = folderName;
    if (isExisting) {
      let count = isExisting;
      let found = false;
      while (!found) {
        name = [folderName, count].join(' ');
        if (this.findFolder(name)) {
          count++;
        } else {
          found = true;
        }
      }
      name = [folderName, count].join(' ');
    }
    return name;
  }

  handleFolderNameChange = event => {
    this.setState({folderName: event.target.value});
  }

  handleInputFocus = event => {
    event.currentTarget.select();
  }

  closeModal = () => {
    this.props.actions.toggleModal({ modalName: '', ActiveModal: null });
  }

  onCreateFolder = event => {
    event.preventDefault();
    if (!this.state.folderName.length) {
      this.setState({errorMessage: this.props.text.folder_name_required});
      return;
    } else {
      let isExisting = this.findFolder(this.state.folderName);
      if (isExisting) {
        this.setState({errorMessage: this.props.text.existed_folder(this.state.folderName)});
        return;
      } else if (this.state.errorMessage) {
        this.setState({errorMessage: null});
      }
    }
    const folder = {
      directories: [{
        location: {
          proto: 'file',
          name: this.state.folderName,
          path: decodeURIComponent(normalizePath(this.props.path)),
          is_dir: true
        },
        created_time: null,
        modified_time: null
      }],
      loc: {
        lat: null,
        lon: null,
        ip: null
      }
    };
    this.props.actions.createFolder(folder);
  }

  render() {
    const {modalType, actions, text, modalName} = this.props;
    return (
      <div className=''>
        <Modal
          show={modalName === MODAL_NAME}
          onHide={this.closeModal}
          dialogClassName='custom-modal modal-sm'
          backdrop='static'
          keyboard={false}
          container={this}
          id='new-folder-modal'>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {text.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mask'/>
            {this.state.errorMessage &&
              <div className='messages'>
                <Alert onClose={() => {this.setState({errorMessage: null});}}>{this.state.errorMessage}</Alert>
              </div>
            }
            <form name='addFolderForm' onSubmit={this.onCreateFolder}>
              <div className='form-group no-border'>
                <label>{text.folder_input_label}</label>
                <input
                  type='text'
                  ref={ref => { this.folderNameInput = ref; }}
                  className='form-control'
                  name='folderName'
                  placeholder='New Folder'
                  maxLength='128'
                  defaultValue={this.state.folderName}
                  onChange={this.handleFolderNameChange}
                  onFocus={this.handleInputFocus}/>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer >
            <button
              className='btn btn-default'
              onClick={this.closeModal}>
              {text.cancel}
            </button>
            <button className='btn btn-primary' onClick={this.onCreateFolder}>
              {text.create}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.fileReducer.loading
  };
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    toggleModal,
    createFolder
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NewFolderModal);
