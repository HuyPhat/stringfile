import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import ReactTooltip from 'react-tooltip';
import {Link} from 'react-router-dom';

import FSComponent from 'components/FSComponent';
import componentActions from 'components/actions';
import filesActions from 'files/actions';
import * as FilesUtils from 'utils/files';
import {history} from 'AppRoute';

class FSToolbar extends FSComponent {
  static propTypes = {
    buttons: PropTypes.array,
    search: PropTypes.object,
    filter: PropTypes.object,
    details: PropTypes.object,
    record: PropTypes.object,
    updateBreadcrumbs: PropTypes.func,
    filesActions: PropTypes.object,
    breadcrumbs: PropTypes.array,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      breadcrumbs: props.breadcrumbs
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search === '?search' && !nextProps.location.search.length) {
      this.props.updateBreadcrumbs(FilesUtils.loadBreadcrumbs(history.location.pathname));
      this.removeSearchText();
    }
  }

  onSearchChange = (event) => {
    this.setState({searchText: event.target.value});
  }

  handleSearch = (event) => {
    if (event.key === 'Enter') {
      this.props.search.searchFunc(this.state.searchText);
      let breadcrumbs = FilesUtils.loadBreadcrumbs(history.location.pathname);
      breadcrumbs.push({name: 'Search', path: '/search'});
      this.props.updateBreadcrumbs(breadcrumbs);
      history.replace(history.location.pathname + '?search');
    }
  }

  removeSearchText = () => {
    this.setState({searchText: ''});
    this.props.search.resetSearchFunc();
  }

  render() {
    const {buttons, search, filter, details, record} = this.props;
    return (
      <header>
        {buttons.length &&
          <div className='toolbar pull-left' id='toolbar'>
            {buttons.map(btn => {
              return (
                <a key={btn.className + btn.icon}
                  onClick={btn.func}
                  className={`${btn.disabled ? 'disabled' : ''} ${btn.className}`}
                  data-tip={btn.tooltip}>
                  <span className={btn.icon}/>
                </a>
              );
            })}
            <ReactTooltip place='top' type='dark' effect='float'/>
          </div>
        }
        {search &&
         <div className='input-group input-group-rounded pull-left' role='search' id='search-form'>
           <span className='input-group-btn'>
             <button type='button' className='btn search-button'><span className='icon-search' /></button>
           </span>
           {this.state.searchText.length > 0 &&
            <a className='input-icon' onClick={() => {history.replace(history.location.pathname);}}>×</a>
           }
           <input type='text' className='form-control no-clear-button'
             id='keyword'
             placeholder={search.placeholder}
             value={this.state.searchText}
             onChange={this.onSearchChange}
             onKeyUp={this.handleSearch}/>
         </div>}
        <div className='toolbar pull-right'>
          {filter &&
            <a href='javascript:void(0)' data-tip='Filter'>
              <span className='icon-filter' />
            </a>
          }
          {details && (record.id || record.uid) &&
            <a id='tab-panel-btn' data-tip='Details'
              className={`${details.expandPanel ? 'active' : ''}`}
              onClick={details.onClick}>
              <span className='icon-info' />
              <ReactTooltip place='top' type='dark' effect='float'/>
            </a>
          }
          {details && (!record.id && !record.uid) &&
            <a id='tab-panel-btn' data-tip='Details' className='disabled'>
              <span className='icon-info' />
            </a>
          }
        </div>
      </header>
    );
  }
}
const mapStateToProps = state => {
  return {
    breadcrumbs: state.componentReducer.breadcrumbs,
    location: history.location
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateBreadcrumbs: bindActionCreators(componentActions.updateBreadcrumbs, dispatch),
    filesActions: bindActionCreators(filesActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FSToolbar);
