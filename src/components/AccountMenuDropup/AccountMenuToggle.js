import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AccountMenuToggle extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleClick = (event) => {
    event.preventDefault();

    this.props.onClick(event);
  }

  render() {
    const {user} = this.props;
    if (!user || !user.uid || !user.emails) {
      return null;
    }
    return (
      <div className='navbar-footer' id='toggle-account-menu' onClick={this.handleClick}>
        <span className='user-avatar avatar sm display'>{user.first_name && user.first_name[0] || user.emails.primary[0]}</span>
        <span className='info'><strong className=''>{user.first_name} {user.last_name}</strong> {user.emails.primary}</span>
        <span className='icon-arrow-up' />
      </div>
    );
  }
}
AccountMenuToggle.propTypes = {
  onClick: PropTypes.func,
  user: PropTypes.object
};
