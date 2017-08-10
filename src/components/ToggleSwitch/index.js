import PropTypes from 'prop-types';
import React from 'react';

export default class Switch extends React.Component {
  static propTypes = {
    switchState: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    switchState: false,
    onClick: () => {},
    disabled: false,
    className: ''
  };

  constructor(props) {
    super(props);
    this.state = {switchState: this.props.switchState};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({switchState: nextProps.switchState});
  }

  handleClick = (e) => {
    e.preventDefault();
    if (!this.props.disabled) {
      this.props.onClick();
      this.setState({switchState: !this.state.switchState});
    }
  };

  render() {
    const className = ['switch', this.props.className, (this.state.switchState ? 'on ' : ''), (this.props.disabled ? 'disabled deactivate ' : '')].join(' ');
    const switchState = `switch-animate ${this.state.switchState ? 'switch-on' : 'switch-off'}`;
    return (
      <div className={className} onClick={this.handleClick}>
        <div className={switchState}>
          <span className='switch-left' ><i className='icon-check' /></span>
          <label>&nbsp;</label>
          <span className='switch-right' ><i className='icon-cancel' /></span>
        </div>
      </div>
    );
  }
}
