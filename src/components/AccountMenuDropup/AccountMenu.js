import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AccountMenu extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className='multiple-accounts' id='account-menu'>
        <div className='current-account'>
          <ul id='switch-view'>
            {this.props.children}
          </ul>
        </div>
      </div>
    );
  }
}
AccountMenu.propTypes = {
  children: PropTypes.any
};
