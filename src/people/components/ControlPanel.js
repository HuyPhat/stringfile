import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ControlPanel extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  state = {
    searchVal: ''
  }

  handleSearchInput = (event) => {
    const searchVal = event.target.value;
    this.setState({searchVal});
  }

  render() {
    return (
      <header className='no-border'>
        <div className='input-group input-group-rounded pull-left' role='search' id='searchPeople'>
          <span className='input-group-btn'>
            <button type='button' className='btn'><span className='icon-search'/></button>
          </span>
          {this.state.searchVal && <a className='input-icon'>×</a>}
          <input type='text' className='form-control no-clear-button' placeholder='Search' onChange={this.handleSearchInput}/>
        </div>
        <div className='toolbar pull-right people-toolbar'>
          <a title='Filter'><span className='icon-filter'/></a>
        </div>
      </header>
    );
  }
}

const ConnectedControlPanel = connect()(ControlPanel);

export default ConnectedControlPanel;
