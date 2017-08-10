import React from 'react';
import PropTypes from 'prop-types';
import Resumablejs from 'resumablejs';

export default class ReactResumableJs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progressBar: 0,
      messageStatus: '',
      fileList: {files: []},
      isPaused: false,
      isUploading: false,
      dragHover: false
    };

    this.resumable = null;
  }

  componentDidMount = () => {
    const { files } = this.props;
    let ResumableField = new Resumablejs({
      target: this.props.service,
      query: this.props.query || {},
      fileType: this.props.filetypes,
      maxFiles: this.props.maxFiles,
      maxFileSize: this.props.maxFileSize,
      fileTypeErrorCallback: (file, errorCount) => {
        if (typeof this.props.onFileAddedError === 'function') {
          this.props.onFileAddedError(file, errorCount);
        }
      },
      maxFileSizeErrorCallback: (file, errorCount) => {
        if (typeof this.props.onMaxFileSizeErrorCallback === 'function') {
          this.props.onMaxFileSizeErrorCallback(file, errorCount);
        }
      },
      testMethod: this.props.testMethod || 'post',
      testChunks: this.props.testChunks || false,
      headers: this.props.headerObject || {},
      chunkSize: this.props.chunkSize,
      simultaneousUploads: this.props.simultaneousUploads,
      fileParameterName: this.props.fileParameterName,
      generateUniqueIdentifier: this.props.generateUniqueIdentifier,
      forceChunkSize: this.props.forceChunkSize
    });

    if (typeof this.props.maxFilesErrorCallback === 'function') {
      ResumableField.opts.maxFilesErrorCallback = this.props.maxFilesErrorCallback;
    }

    ResumableField.assignBrowse(this.uploader);

    //Enable or Disable DragAnd Drop
    if (this.props.disableDragAndDrop === false) {
      ResumableField.assignDrop(this.dropZone);
    }

    ResumableField.on('fileAdded', (file, event) => {
      // this.setState({
      //   messageStatus: this.props.fileAddedMessage || ' Starting upload! '
      // });
      let currentFiles = this.state.fileList.files;
      currentFiles.push(file);
      this.setState({fileList: {files: currentFiles}});
      if (typeof this.props.onFileAdded === 'function') {
        this.props.onFileAdded(file, this.resumable);
      } else {
        // ResumableField.upload();
      }
      this.onDragLeave();
    });

    ResumableField.on('fileSuccess', (file, fileServer) => {

      if (this.props.fileNameServer) {
        let objectServer = JSON.parse(fileServer);
        file.fileName = objectServer[this.props.fileNameServer];
      } else {
        file.fileName = fileServer;
      }
      // Implement later, mark file as compeleted
    });

    ResumableField.on('progress', () => {

      this.setState({
        isUploading: ResumableField.isUploading()
      });

      if ((ResumableField.progress() * 100) < 100) {
        this.setState({
          messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
          progressBar: ResumableField.progress() * 100
        });
      } else {
        setTimeout(() => {
          this.setState({
            progressBar: 0
          });
        }, 1000);
      }

    });

    ResumableField.on('fileError', (file, errorCount) => {
      this.props.onUploadErrorCallback(file, errorCount);
    });

    if (files) {
      files.forEach((file) => {
        ResumableField.addFile(file);
      });
    }

    this.resumable = ResumableField;
  };

  removeFile = (event, file, index) => {

    event.preventDefault();

    let currentFileList = this.state.fileList.files;
    currentFileList.splice(index, 1);

    this.setState({
      fileList: {files: currentFileList}
    });

    this.props.onFileRemoved(file, index);
    this.resumable.removeFile(file);
  };

  cancelUpload = () => {
    this.resumable.cancel();

    this.setState({
      fileList: {files: []}
    });

    this.props.onCancelUpload();
  };

  pauseUpload = () => {
    if (!this.state.isPaused) {

      this.resumable.pause();
      this.setState({
        isPaused: true
      });
      this.props.onPauseUpload();
    } else {

      this.resumable.upload();
      this.setState({
        isPaused: false
      });
      this.props.onResumeUpload();
    }
  };
  triggerSelectFile = (event) => {
    document.getElementById(this.props.uploaderID).click();
  };
  onDragOver = (event) => {
    this.setState({dragHover: true});
  };
  onDragLeave = (event) => {
    this.setState({dragHover: false});
  };
  startUpload = () => {
    this.resumable.upload();
    this.setState({
      isPaused: false
    });
    this.props.onStartUpload();
  };
  /*eslint complexity: ["error", 20]*/
  render() {
    const {className} = this.props;
    let startButton = null;
    if (this.props.startButton) {
      if (typeof this.props.startButton === 'string' || typeof this.props.startButton === 'boolean') {startButton = <label>
        <button disabled={this.state.isUploading} className='btn start' onClick={this.startUpload}>{this.props.startButton && 'upload'}
        </button>
      </label>;}
      else {startButton = this.props.startButton;}
    }

    let cancelButton = null;
    if (this.props.cancelButton) {
      if (typeof this.props.cancelButton === 'string' || typeof this.props.cancelButton === 'boolean') {cancelButton = <label>
        <button disabled={!this.state.isUploading} className='btn cancel' onClick={this.cancelUpload}>{this.props.cancelButton && 'cancel'}
        </button>
      </label>;}
      else {cancelButton = this.props.cancelButton;}
    }

    let pauseButton = null;
    if (this.props.pauseButton) {
      if (typeof this.props.pauseButton === 'string' || typeof this.props.pauseButton === 'boolean') {pauseButton = <label>
        <button disabled={!this.state.isUploading} className='btn pause' onClick={this.pauseUpload}>{this.props.pauseButton && 'pause'}
        </button>
      </label>;}
      else {pauseButton = this.props.pauseButton;}
    }

    return (
      <div>
        <div id={this.props.dropTargetID}
          ref={node => {this.dropZone = node;}}
          className={`fileAPI ${className} ${this.state.dragHover ? 'drag-hover' : ''}` }
          onClick={this.triggerSelectFile}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
        >
          {/* {previousText} */}
          {/* <label className={this.props.disableInput ? 'btn file-upload disabled' : 'btn file-upload'}>{textLabel} */}
          <input
            type='file'
            ref={node => {this.uploader = node;}}
            id={this.props.uploaderID}
            className='hide'
            name={this.props.uploaderID + '-upload'}
            accept={this.props.fileAccept || '*'}
            disabled={this.props.disableInput || false}
          />
          <div className='instructions'>
            <span className='drag'>Drag file here to upload</span>
            <span className='drop'>Drop it now</span>
          </div>
          {/* </label> */}
          {/* <div className='progress' style={{display: this.state.progressBar === 0 ? 'none' : 'block'}}>
            <div className='progress-bar' style={{width: this.state.progressBar + '%'}} />
          </div> */}
        </div>
        {startButton}
        {/* {pauseButton} */}
        {/* {cancelButton} */}
      </div>
    );
  }
}
ReactResumableJs.propTypes = {
  service: PropTypes.string,
  fileAccept: PropTypes.string,
  uploaderID: PropTypes.string,
  previousText: PropTypes.string,
  completedMessage: PropTypes.string,
  testChunks: PropTypes.string,
  tmpDir: PropTypes.string,
  selectedFiles: PropTypes.string,
  fileParameterName: PropTypes.string,
  fileAddedMessage: PropTypes.string,
  filetypes: PropTypes.array,
  textLabel: PropTypes.string,
  fileNameServer: PropTypes.string,
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  chunkSize: PropTypes.number,
  forceChunkSize: PropTypes.bool,
  simultaneousUploads: PropTypes.number,
  query: PropTypes.func,
  testMethod: PropTypes.string,
  headerObject: PropTypes.object,
  disableInput: PropTypes.bool,
  disableDragAndDrop: PropTypes.bool,
  dropTargetID: PropTypes.string,
  pauseButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  showFileList: PropTypes.bool,
  startButton: PropTypes.bool,
  onCancelUpload: PropTypes.func,
  onResumeUpload: PropTypes.func,
  onStartUpload: PropTypes.func,
  onPauseUpload: PropTypes.func,
  onFileAdded: PropTypes.func,
  onFileRemoved: PropTypes.func,
  onFileAddedError: PropTypes.func,
  onMaxFileSizeErrorCallback: PropTypes.func,
  onFileSuccess: PropTypes.func,
  maxFilesErrorCallback: PropTypes.func,
  generateUniqueIdentifier: PropTypes.func,
  onUploadErrorCallback: PropTypes.func
};
ReactResumableJs.defaultProps = {
  maxFiles: undefined,
  uploaderID: 'default-resumable-uploader',
  dropTargetID: 'dropTarget',
  filetypes: [],
  fileAccept: '*',
  // maxFileSize: 10240000,
  showFileList: true,
  onUploadErrorCallback: (file, errorCount) => {
    console.log('error', file, errorCount);
  },
  onFileRemoved(file) {
    return file;
  },
  onCancelUpload() {
    return true;
  },
  onPauseUpload() {
    return true;
  },
  onResumeUpload() {
    return true;
  },
  onStartUpload() {
    return true;
  },
  disableDragAndDrop: false,
  fileNameServer: '',
  tmpDir: '',
  chunkSize: 1024 * 1024,
  simultaneousUploads: 1,
  fileParameterName: 'file',
  generateUniqueIdentifier: null,
  maxFilesErrorCallback: null,
  cancelButton: false,
  pause: false,
  startButton: null,
  pauseButton: null,
  previousText: '',
  headerObject: {},
  forceChunkSize: false
};
