import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Dropdown, DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { FILE_TYPE_SUPPORT } from '../../constants';

import FSComponent from 'components/FSComponent';
import componentActions from 'components/actions';
import { FSContextMenu, FSMenuItem } from 'components/ContextMenu';
import StringFileModal from './StringFileModal';

class StringFileButton extends FSComponent {

  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  selectFileLocal = () => {
    this.selectFileInput.click();
  }

  onSelectedFiles = (e) => {
    this.setState({files: e.target.files}, () => {
      this.props.toggleModal({modalName: StringFileModal.MODAL_NAME, modalProps: {files: this.state.files}, ActiveModal: StringFileModal});
    });
  }

  render() {
    return (
      <div id='stringFileBtnWrapper'>
        <input
          type='file'
          ref={node => {this.selectFileInput = node;}}
          id='selectFiles'
          className='hide'
          multiple
          onChange={this.onSelectedFiles}
          accept={FILE_TYPE_SUPPORT.join(',.')}
        />
        <Dropdown id='stringFileBtn' componentClass='div'
          dropup >
          <Dropdown.Toggle className='btn btn-primary' id='stringFileBtn' noCaret>
            <span className='icon-plus'/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem header>String files from</MenuItem>
            <MenuItem onClick={this.selectFileLocal}><span className='icon-computer' /> My Computer</MenuItem>
            <MenuItem eventKey='2'><span className='icon-push-update' /> My Cloud</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

}
const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: bindActionCreators(componentActions.toggleModal, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StringFileButton);
