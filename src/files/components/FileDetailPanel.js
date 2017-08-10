import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import ReactTooltip from 'react-tooltip';

import FSComponent from 'components/FSComponent';
import {elapsedTime, displayTime} from 'utils/DateTime';
import {getFileType, fileSize, getFileOwnerName} from 'utils/files';
import fileActions from '../actions';

const {getFileStats} = fileActions;

class FileDetailPanel extends FSComponent {
    static propTypes = {
      file: PropTypes.object,
      getFileStats: PropTypes.func,
      fileStats: PropTypes.object
    }

    constructor(props) {
      super(props);
      this.state = {
        file: this.props.file,
        fileStats: this.props.fileStats
      };
    }

    componentWillMount() {
      if (!this.props.file.location.is_dir) {
        this.props.getFileStats(this.props.file.id);
      }
    }

    componentWillReceiveProps(nextProps) {
      console.log(nextProps);
      if (nextProps.file.id !== this.state.file.id) {
        this.setState({file: nextProps.file});
        if (!nextProps.file.location.is_dir) {
          this.props.getFileStats(nextProps.file.id);
        }
      }
      this.setState({fileStats: nextProps.fileStats});
    }

    render() {
      const { file, fileStats } = this.state;
      const text = this.text;
      return (
        <table className='table' >
          <tbody>
            <tr>
              <td>{text.type}</td>
              <td>{file.location.is_dir ? 'Folder' : getFileType(file.location.name)}</td>
            </tr>
            {file.location.is_dir &&
              <tr>
                <td>{text.items_num}</td>
                <td>{file.content.child_count}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.size}</td>
                <td>{fileSize(file.content.size.origin)}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.owner}</td>
                <td>{getFileOwnerName(file)}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.created}</td>
                <td>{elapsedTime(file.changes.created_time)}</td>
              </tr>
            }
            <tr>
              <td>{text.last_modified}</td>
              <td>{elapsedTime(file.changes.file_modified_time)}</td>
            </tr>
            {!file.location.is_dir &&
              <tr>
                <td>{text.last_push_updated}</td>
                <td>{fileStats.last_push_update_time ? elapsedTime(fileStats.last_push_update_time) : 'Never'}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.last_shared}</td>
                <td>{fileStats.last_shared_time ? elapsedTime(fileStats.last_shared_time) : 'Never'}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.last_viewed}</td>
                <td>{fileStats.last_viewed_time ? elapsedTime(fileStats.last_viewed_time) : 'Never'}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.views}</td>
                <td>{fileStats.total_view}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.viewers}</td>
                <td>{fileStats.total_viewing_user}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.total_view_time}</td>
                <td>{displayTime(fileStats.total_viewing_time)}</td>
              </tr>
            }
            {!file.location.is_dir &&
              <tr>
                <td>{text.average_view_time}</td>
                <td>{displayTime(fileStats.average_viewing_time)}</td>
              </tr>
            }
          </tbody>
        </table>
      );
    }
}
const mapStateToProps = state => {
  return {
    fileStats: state.fileReducer.fileStats
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getFileStats: bindActionCreators(getFileStats, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileDetailPanel);
