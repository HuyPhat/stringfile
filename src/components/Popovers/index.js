import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* Warning: 
  1. Don't try to show popovers on hidden elements
*/

class Popovers extends Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    className: PropTypes.string,
    customClass: PropTypes.string,
    placement: PropTypes.string, // top | bottom | left | right | auto
    type: PropTypes.string, // success, alert, info, default
    container: PropTypes.bool, // Appends the popover to a specific element.
    animation: PropTypes.bool, // Apply a CSS fade transition to the popover
    delay: PropTypes.number || PropTypes.object, // delay: { "show": 500, "hide": 100 }
    html: PropTypes.bool,
    template: PropTypes.string,
    trigger: PropTypes.string // How popover is triggered - click | hover | focus | manual
  };

  static defaultProps = {
    title: 'This is your title',
    content: 'This is your content',
    className: '',
    customClass: '',
    placement: 'right',
    type: 'default',
    container: false,
    animation: true,
    delay: 0,
    html: false,
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
    trigger: 'click'
  };

}

export default Popovers;
