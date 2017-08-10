import React from 'react';
import PropTypes from 'prop-types';
import { RootCloseWrapper } from 'react-overlays';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';

import AccountMenu from './AccountMenu';
import AccountMenuToggle from './AccountMenuToggle';

export class AccountMenuDropup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleOpenState = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <RootCloseWrapper onRootClose={() => this.setState({open: false})}>
        <Dropdown id='account-menu' componentClass='div' dropup open={this.state.open} onToggle={this.toggleOpenState}>
          <AccountMenuToggle bsRole='toggle' user={this.props.user}/>
          <AccountMenu bsRole='menu'>
            <MenuItem href='/sign-out'>Sign Out</MenuItem>
          </AccountMenu>
        </Dropdown>
      </RootCloseWrapper>
    );
  }
}

AccountMenuDropup.propTypes = {
  user: PropTypes.object
};
