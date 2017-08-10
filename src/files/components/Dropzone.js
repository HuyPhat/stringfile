import React from 'react';
import PropTypes from 'prop-types';

class Dropzone extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='empty-folder-wrap'>
        <div className='drop-zone'>
          <div className='dropzone drop-box drop-zone' id='primaryUploaderDropzone1501226553925' style={{'zIndex': 1}}>
            <span className='big-circle'>
              <span className='icon-photo' />
              <span className='icon-video' />
              <span className='icon-volume' />
              <span className='icon-excel' />
              <span className='icon-word' />
              <span className='icon-text' />
              <span className='icon-pdf' />
              <span className='icon-power-point' />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Dropzone;
