import React from 'react';
import {MenuItem} from 'react-contextmenu';
import cx from 'classnames';

export default class FSMenuItem extends MenuItem {
  render() {
    const { disabled, divider, children, attributes, selected } = this.props;
    const menuItemClassNames = cx(attributes && attributes.className);

    return (
      <li
        {...attributes} className={menuItemClassNames}
        role='menuitem' tabIndex='-1' aria-disabled={disabled ? 'true' : 'false'}
        aria-orientation={divider ? 'horizontal' : null}
        ref={(ref) => { this.ref = ref; }}
        onMouseMove={this.props.onMouseMove} onMouseLeave={this.props.onMouseLeave}
        onTouchEnd={this.handleClick} onClick={this.handleClick}>
        {divider ? null : children}
      </li>
    );
  }
}
