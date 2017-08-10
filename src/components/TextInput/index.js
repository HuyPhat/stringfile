import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.Component {
    static propTypes = {
      type: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      errorRequireMsg: PropTypes.string,
      errorInValidMsg: PropTypes.string,
      className: PropTypes.string,
      validateOnChange: PropTypes.bool,
      showError: PropTypes.bool,
      required: PropTypes.bool,
      validateFunc: PropTypes.func,
      onChange: PropTypes.func,
      value: PropTypes.string,
      setValidateState: PropTypes.func
    }
    constructor(props) {
      super(props);
      this.state = {
        value: props.value ? props.value : '',
        isValid: false,
        errorMsg: ''
      };
      if (props.value) {
        this.state.isValid = true;
      }
      if (props.value && props.validateFunc) {
        if (!props.validateFunc(props.value)) {
          this.state.isValid = false;
          this.state.errorMsg = props.errorInValidMsg;
        } else {
          this.state.isValid = true;
        }
      }
    }

    onChange = event => {
      this.state.value = event.target.value;
      const { validateFunc, onChange, name, errorInValidMsg, errorRequireMsg, required, setValidateState } = this.props;
      onChange(name, event.target.value);
      if (required && event.target.value === '') {
        this.setState({isValid: false, errorMsg: errorRequireMsg});
        if (setValidateState) {
          setValidateState(name, false);
        }
        return;
      } else {
        this.setState({isValid: true});
        if (setValidateState) {
          setValidateState(name, true);
        }
      }
      if (validateFunc) {
        if (!validateFunc(this.state.value)) {
          this.setState({isValid: false, errorMsg: errorInValidMsg});
          if (setValidateState) {
            setValidateState(name, false);
          }
        } else {
          this.setState({isValid: true});
          if (setValidateState) {
            setValidateState(name, true);
          }
        }
      }
    };

    render() {
      const { validateOnChange, type, className, name, showError, placeholder } = this.props;
      const { value, isValid } = this.state;
      let errorMsg = this.state.errorMsg;
      if (!errorMsg) {
        errorMsg = this.props.errorRequireMsg;
      }
      let allClass = `${className} ${!isValid && (showError) ? 'danger' : ''}`;
      return (
        <div>
          <input type={type} className={allClass} name={name} value={value} onChange={this.onChange} placeholder={placeholder}/>
          {!isValid && showError &&
            <span className='help-block' ><span className='icon-notice' />{errorMsg}</span>
          }
        </div>
      );
    }
}
export default TextInput;
