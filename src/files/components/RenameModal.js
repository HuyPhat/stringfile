import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Modal} from 'react-bootstrap';
import Alert from 'components/Alert';
import FSComponent from 'components/FSComponent';
import actionsFunc from 'components/actions';
import fileActions from '../actions';
import {getIconForMineType, getExtension, normalizePath} from 'utils/files';

const {toggleModal} = actionsFunc;
const {changeDirectoryMeta} = fileActions;
const MODAL_NAME = 'RenameFileDirectory';

class RenameModal extends FSComponent {
  static MODAL_NAME = MODAL_NAME;
  static propTypes = {
    file: PropTypes.object,
    actions: PropTypes.object,
    modalType: PropTypes.string,
    modalName: PropTypes.string,
    path: PropTypes.string,
    loading: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      newName: '',
      errorMessage: null
    };
  }

  componentWillMount() {
    const fileExt = getExtension(this.props.file.location.name);
    this.setState({newName: this.props.file.location.name.replace('.' + fileExt, '')});
  }

  componentDidMount() {
    if (this.nameInput) {
      this.nameInput.focus();
    }
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      this.closeModal();
    }
  }

  handleNameChange = event => {
    this.setState({newName: event.target.value});
  }

  handleInputFocus = event => {
    event.currentTarget.select();
  }

  closeModal = () => {
    this.props.actions.toggleModal({ modalName: '', ActiveModal: null });
  }

  onRename = (event) => {
    event.preventDefault();
    const {file, path} = this.props;
    const {newName} = this.state;
    let payload = {
      directory_id: file.id,
      path: path,
      data: {
        loc: {
          lat: null,
          lon: null,
          ip: null
        }
      }
    };
    if (file.location.is_dir) {
      payload.data['action'] = {
        change: {
          location: {
            name: newName,
            path: decodeURIComponent(normalizePath(path))
          }
        }
      };
      this.props.actions.changeDirectoryMeta(payload);
    }
  }

  render() {
    const {file, modalType, actions, text, modalName} = this.props;
    return (
      <div className=''>
        <Modal
          show={modalName === MODAL_NAME}
          onHide={this.closeModal}
          dialogClassName='custom-modal modal-sm'
          backdrop='static'
          keyboard={false}
          container={this}
          id='rename-modal'>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>{file.location.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mask'/>
            {this.state.errorMessage &&
              <div className='messages'>
                <Alert onClose={() => {this.setState({errorMessage: null});}}>{this.state.errorMessage}</Alert>
              </div>
            }
            <form name='renameForm' onSubmit={this.onRename}>
              <div className='form-group no-border'>
                <label>{file.location.is_dir ? this.text.folder_input_label : this.text.file_input_label}</label>
                <input
                  type='text'
                  ref={ref => { this.nameInput = ref; }}
                  className='form-control'
                  name='folderName'
                  placeholder='New Folder'
                  maxLength='128'
                  defaultValue={this.state.newName}
                  onChange={this.handleNameChange}
                  onFocus={this.handleInputFocus}/>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer >
            <button
              className='btn btn-default'
              onClick={this.closeModal}>
              {this.text.cancel}
            </button>
            <button className='btn btn-primary' onClick={this.onRename}>
              {this.text.rename}
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
    changeDirectoryMeta
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RenameModal);
