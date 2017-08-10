import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';

import FilesTable from '../components/FilesTable';
import filesActions from '../actions';
import componentActions from 'components/actions';
import * as FilesUtils from 'utils/files';
import StringFileBtn from '../components/StringFileBtn';
// import { hideLoading, resetLoading } from 'react-redux-loading-bar';
const rootDir = '/all-files';

class FilesContainer extends React.Component {
  static propTypes = {
    filesActions: PropTypes.object,
    files: PropTypes.object,
    location: PropTypes.object,
    updateBreadcrumbs: PropTypes.func,
    resetLoading: PropTypes.func,
    setAppClass: PropTypes.func,
    searchedFiles: PropTypes.array,
    needUpdate: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      pathname: this.props.location.pathname
    };
  }

  componentWillMount() {
    const {location, files} = this.props;
    this.fetchFiles(location);
    this.props.updateBreadcrumbs(FilesUtils.loadBreadcrumbs(location.pathname));
    this.props.setAppClass({appClass: 'my-files'});
  }

  componentWillReceiveProps(nextProps) {
    const {location, files} = nextProps;
    let filesList;
    if (this.state.pathname !== location.pathname) {
      this.props.updateBreadcrumbs(FilesUtils.loadBreadcrumbs(location.pathname));
      this.setState({pathname: location.pathname});
      filesList = FilesUtils.getFilesFromPath(this.props.files, FilesUtils.normalizePath(location.pathname));
      if (filesList === null) {
        this.fetchFiles(location);
      }
    }
    if (this.props.location.search === '?search' && !nextProps.location.search.length) {
      this.fetchFiles(nextProps.location);
    }
    if (nextProps.needUpdate) {
      this.fetchFiles(location);
    }
  }

  fetchFiles = (location) => {
    this.props.filesActions.fetchFiles({path: FilesUtils.normalizePath(location.pathname)});
  }

  getFilesFromPath = () => {
    const result = FilesUtils.getFilesFromPath(this.props.files, FilesUtils.normalizePath(this.state.pathname));
    return result;
  }

  render() {
    let list = this.getFilesFromPath();
    if (!list) {
      return null;
    }
    return (
      <div style={{'height': '100%'}}>
        <FilesTable files={list} path={this.state.pathname}/>
        <StringFileBtn />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    files: state.fileReducer.files,
    searchedFiles: state.fileReducer.searchedFiles,
    breadcrumbs: state.componentReducer.breadcrumbs,
    fetchingAuth: state.authReducer.fetching,
    needUpdate: state.fileReducer.needUpdate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filesActions: bindActionCreators(filesActions, dispatch),
    updateBreadcrumbs: bindActionCreators(componentActions.updateBreadcrumbs, dispatch),
    setAppClass: bindActionCreators(componentActions.setAppClass, dispatch)
    // hideLoading: bindActionCreators(hideLoading, dispatch),
    // resetLoading: bindActionCreators(resetLoading, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesContainer);
