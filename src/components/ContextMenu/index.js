import React from 'react';
import { ContextMenu } from 'react-contextmenu';
import cx from 'classnames';
import FSMenuItem from './MenuItem';

class FSContextMenu extends ContextMenu {

  render() {
    const { children, className } = this.props;
    const { isVisible } = this.state;
    const style = { position: 'fixed', opacity: 0, pointerEvents: 'none' };
    const menuClassnames = cx(className, {
      ['open']: isVisible
    });

    return (
      <div className={menuClassnames}>
        <ul
          role='menu' tabIndex='-1' ref={this.menuRef} style={style} className='dropdown-menu'
          onContextMenu={this.handleContextMenu} onMouseLeave={this.handleMouseLeave}>
          {this.renderChildren(children)}
        </ul>
      </div>
    );
  }
}
export { FSContextMenu, FSMenuItem };
