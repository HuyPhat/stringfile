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
const MODAL_NAME = 'DeleteFile';

class DeleteFolderModal extends FSComponent {
  static MODAL_NAME = MODAL_NAME;
  static propTypes = {
    directory: PropTypes.object,
    actions: PropTypes.object,
    modalType: PropTypes.string,
    modalName: PropTypes.string,
    path: PropTypes.string,
    loading: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      this.closeModal();
    }
  }

  closeModal = () => {
    this.props.actions.toggleModal({ modalName: '', ActiveModal: null });
  }

  onDeleteFolder = (event) => {
    event.preventDefault();
    const {directory, path} = this.props;
    const payload = {
      directory_id: directory.id,
      path: path,
      data: {
        loc: {
          lat: null,
          lon: null,
          ip: null
        },
        action: {delete: {}}
      }
    };
    this.props.actions.changeDirectoryMeta(payload);
  }

  render() {
    const {directory, modalType, actions, text, modalName} = this.props;
    return (
      <div className=''>
        <Modal
          show={modalName === MODAL_NAME}
          onHide={this.closeModal}
          dialogClassName='custom-modal modal-sm'
          backdrop='static'
          keyboard={false}
          container={this}
          id='delete-folder-modal'>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'/>
          </Modal.Header>
          <Modal.Body>
            <div className='mask'/>
            <p>{directory.content.child_count === 0 ? this.text.delete_folder_question : 'This folder is not empty and cannot be deleted.'}</p>
          </Modal.Body>
          <Modal.Footer >
            <button
              className='btn btn-default btn-block'
              onClick={this.closeModal}>
              {this.text.cancel}
            </button>
            {directory.content.child_count === 0 &&
              <button className='btn btn-danger btn-block' onClick={this.onDeleteFolder}>
                {this.text.delete}
              </button>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFolderModal);
