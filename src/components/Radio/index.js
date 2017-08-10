import React from 'react';
import PropTypes from 'prop-types';

export default class RadioButton extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    labelText: PropTypes.string,
    className: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.props = nextProps;
    }
  }

  render() {
    const { checked, labelText, className } = this.props;
    return (
      <label className={`radio radio-inline ${className} ${checked ? 'checked' : '' }`} onClick={this.props.onClick}>
        <span className='icons'>
          <span className='first-icon icon-radio-unchecked' />
          <span className='second-icon icon-radio-checked' />
        </span>
        <span />
        { labelText }
      </label>
    );
  }
}
