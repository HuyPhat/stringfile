import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal } from 'react-bootstrap';
import { ReactTags } from 'components/Tags/ReactTags';
// import Dropzone from 'react-dropzone';
import { FS_TOKEN, FILE_TYPE_SUPPORT } from '../../constants';
import ReactResumableJs from 'components/ReactResumableJs';
import actionsFunc from 'components/actions';
import Switch from 'components/ToggleSwitch';
import ReactDateTime from 'components/DateTimePicker';
import Checkbox from 'components/Checkbox';
import fileActions from '../actions';
import { guid } from 'utils/ajax';
import { getIconForMineType, getExtension } from 'utils/files';
import ENV_VARIABLES from 'config/variables';

const { toggleModal } = actionsFunc;
const { uploadFiles } = fileActions;
const MODAL_NAME = 'ADD_USER';
class StringFileModal extends React.Component {
  static MODAL_NAME = MODAL_NAME
  constructor() {
    super();
    this.state = {
      files: [],
      meta: {
        permissions: {
          reshare: true
        },
        emailNotify: true
      },
      step: 0,
      openedDateTimePicker: false,
      modalState: 'maximun',
      tags: []
    };
  }
  queryParams = (resumablefile) => {
    return {
      upid: resumablefile.file.uniqueIdentifier,
      access_token: sessionStorage.getItem(FS_TOKEN)
    };
  }
  changeStep = (step) => {
    this.setState({ step });
  }
  onString = () => {
    // this.props.actions.uploadFiles(this.state);
    this.setState({modalState: 'nomral'});
  }
  removeFile = (file, index) => {
    let currentFileList = this.state.files;
    currentFileList.splice(index, 1);
    console.log(currentFileList);
    this.setState({
      files: currentFileList
    });
  }
  createFileList = () => {

    let markup = this.state.files.map((file, index) => {
      let uniqID = 'fs-uploader-' + index;
      let originFile = file.file;
      let icon = getIconForMineType(getExtension(originFile.name));
      return <li className='tag' key={uniqID} title={ originFile.name }>
        <span className={icon} /> <span className='text'>{ originFile.name }</span>
        {this.state.step === 0 &&
        <a onClick={(event) => this.removeFile(event, file, index)} href='#'>
          <i className='glyphicon glyphicon-minus-sign' /></a>
        }
      </li>;
    });

    return <ul id='items-fs-uploader'>{markup}</ul>;
  };
  changeModalState = (state) => {
    this.setState({modalState: state});
  }
  onAddTag = (tag) => {
    let { tags } = this.state;
    this.setState({ tags: [...tags, { id: tags.length + 1, text: tag }] });
  }
  onRemoveTag = (i) => {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags});
  }
  /*eslint-disable*/
  render() {
    const { modalName, modalProps, actions, text, files } = this.props;
    const { tags, openedDateTimePicker, modalState } = this.state;
    let fileList = '';
    if (this.state.files.length) {
      fileList = <div className='selected-files'>
        <label className='selected-file-label'>{this.props.text.selectedFiles}: </label>
        {this.createFileList()}
      </div>;
    }
    const { reshare, allowPrinting, watermark, allowDownloading } = this.state.meta.permissions;
    return (
      <div className={`string-file-modal-container ${modalState}`}>
        <Modal
          show={modalName === MODAL_NAME}
          onHide={() =>
            actions.toggleModal({ modalType: undefined, modalProps: {} })}
          dialogClassName='custom-modal'
          backdrop='static' keyboard={false}
          container={this}
          id='string-file'
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-lg'>
              <button className='close minimize' onClick={() => {this.changeModalState('minimize');}}><i className='glyphicon glyphicon-chevron-down' /></button>
              <button className='close normal' onClick={() => {this.changeModalState('normal');}}><i className='glyphicon glyphicon-chevron-up' /></button>
              {text.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.step === 0 &&
            <div className='step-0'>
              <ReactResumableJs
                uploaderID='fs-uploader'
                filetypes={FILE_TYPE_SUPPORT}
                fileAccept={FILE_TYPE_SUPPORT.join(',.')}
                fileAddedMessage='Started!'
                completedMessage='Complete!'
                service={`${ENV_VARIABLES.FILE_SERVER}upload`}
                className='hide'
                files={files}
                disableDragAndDrop={true}
                onFileSuccess={(file, message) => {
                  console.log(file, message);
                }}
                onFileAdded={(file, resumable) => {
                  let files = this.state.files;
                  files.push(file);
                  this.setState({ files });
                }}
                onFileRemoved={this.removeFile}
                query={this.queryParams}
                maxFiles={10}
                startButton={true}
                pauseButton={false}
                cancelButton={true}
                generateUniqueIdentifier={guid}
                onCancelUpload={() => {
                  this.inputDisable = false;
                }}
                onPauseUpload={() => {
                  this.inputDisable = false;
                }}
                onUploadErrorCallback={() => {
                  this.resumable.cancel();
                }}
                onResumeUpload={() => {
                  this.inputDisable = true;
                }}
              />
              {fileList}
            </div>}
            { this.state.step === 1 &&
              <div className='step-1'>
                {fileList}
                <label>{ this.props.text.addRecepients }</label>
                <ReactTags tags={tags}
                  handleAddition={this.onAddTag}
                  handleDelete={this.onRemoveTag}
                  classNames={{
                    tags: 'tagsinput'
                  }}
                />
                <label>{ this.props.text.permissions }</label>
                <div className='permissions' >
                  <div className='form-group' >
                    <label>{this.props.text.reshare}</label>
                    <Switch onClick={() => {console.log('toggle switch');}} switchState={reshare} className='pull-right'/>
                  </div>
                  <div className='form-group' >
                    <label>{this.props.text.expire}</label>
                    <div className='input-group date'>
                      <ReactDateTime input={true} open={openedDateTimePicker}
                        onClickOutside={() => {this.setState({openedDateTimePicker: false});}}
                      />
                      <span className='input-group-addon' onClick={() => {this.setState({openedDateTimePicker: true});}}
                      >
                        <span className='icon-calendar' />
                      </span>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label>{this.props.text.allowPrinting}</label>
                    <Switch onClick={() => {console.log('toggle switch');}} switchState={allowPrinting} className='pull-right'/>
                  </div>
                  <div className='form-group'>
                    <label>{this.props.text.displayWatermark}</label>
                    <Switch onClick={() => {console.log('toggle switch');}} switchState={watermark} className='pull-right'/>
                  </div>
                  <div className='form-group'>
                    <label>{this.props.text.allowDownloading}</label>
                    <Switch onClick={() => {console.log('toggle switch');}} switchState={allowDownloading} className='pull-right'/>
                  </div>
                </div>
                {/* <div className='file-links' /> */}
                <div className='message'>
                  <Checkbox onClick={() => {
                    let { meta } = this.state;
                    meta.emailNotify = !meta.emailNotify;
                    this.setState({ meta });
                  }} checked={this.state.meta.emailNotify}
                  labelText={this.props.text.notifyRecepients}
                  />
                  <textarea placeholder='I shared this file with you using FileString' className='form-control message'/>
                </div>
              </div>
            }
          </Modal.Body>
          <Modal.Footer >
            <button className='btn btn-default pull-left'
              onClick={() => actions.toggleModal({ modalType: undefined, modalProps: {}})}> {text.cancel}
            </button>
            <button
              className={`btn btn-primary pull-right ${this.state.step !== 1 ? 'hide' : ''}`}
              onClick={this.onString} >{text.string}
            </button>
            <button className={`btn btn-primary pull-right ${this.state.step === 1 ? 'hide' : ''}`}
              disabled={this.state.files.length === 0} onClick={() => this.changeStep(this.state.step + 1)} >
              {text.next}
            </button>
            <button className='btn btn-default pull-right'
              disabled={this.state.step === 0}
              onClick={() => this.changeStep(this.state.step - 1)}>
              {text.back}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

StringFileModal.propTypes = {
  text: PropTypes.object,
  modalName: PropTypes.string,
  modalProps: PropTypes.object,
  actions: PropTypes.object,
  files: PropTypes.array
};
StringFileModal.defaultProps = {
  text: {
    title: 'String Files',
    cancel: 'Cancel',
    next: 'Next',
    back: 'Back',
    string: 'String',
    addRecepients: 'Add recepients',
    selectedFiles: 'Selected files',
    permissions: 'Permissions',
    reshare: 'Re-share',
    allowPrinting: 'Allow printing',
    allowDownloading: 'Allow file downloading',
    displayWatermark: 'Display watermark when viewed',
    expire: 'Expire recepient access',
    notifyRecepients: 'Notify recepients via email'
  }
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      toggleModal,
      uploadFiles
    },
    dispatch
  )
});
/*eslint-enable*/
export default connect(null, mapDispatchToProps)(StringFileModal);
