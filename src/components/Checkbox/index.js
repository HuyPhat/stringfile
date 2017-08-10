import React from 'react';
import PropTypes from 'prop-types';

export default class Checkbox extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.props = nextProps;
    }
  }
  render() {
    const { checked, labelText, id, onChange } = this.props;
    return (
      <label className={`checkbox ${checked ? 'checked' : '' }`} id={id} onClick={e => {
        e.currentTarget.checked = !checked; if (this.props.onClick) {
          this.props.onClick(e);}
      }}>
        <span className='icons'>
          <span className='first-icon icon-checkbox-unchecked' />
          <span className='second-icon icon-checkbox-checked' />
        </span>
        <span />
        { labelText }
      </label>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  labelText: PropTypes.string
};
