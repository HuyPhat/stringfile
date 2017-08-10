
// Clone from https://github.com/YouCanBookMe/react-datetime
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CalendarContainer from 'react-datetime/src/CalendarContainer';

export default class ReactDatetime extends React.Component {

  constructor(props) {
    super(props);
    let state = this.getStateFromProps(this.props);

    if (state.open === undefined) {
      state.open = !this.props.input;
    }

    state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';
    this.allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds'];
    this.componentProps = {
      fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
      fromState: ['viewDate', 'selectedDate', 'updateOn'],
      fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
    };
    this.state = state;
  }

  componentWillReceiveProps(nextProps) {
    let formats = this.getFormats(nextProps);
    let updatedState = this.getStateFromProps(nextProps);

    if (updatedState.open === undefined) {
      if (this.props.closeOnSelect && this.state.currentView !== 'time') {
        updatedState.open = false;
      } else {
        updatedState.open = this.state.open;
      }
    }

    if (nextProps.viewMode !== this.props.viewMode) {
      updatedState.currentView = nextProps.viewMode;
    }

    if (nextProps.locale !== this.props.locale) {
      if (this.state.viewDate) {
        var updatedViewDate = this.state.viewDate.clone().locale(nextProps.locale);
        updatedState.viewDate = updatedViewDate;
      }
      if (this.state.selectedDate) {
        var updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
      }
    }

    if (nextProps.utc !== this.props.utc) {
      if (nextProps.utc) {
        if (this.state.viewDate)
        {updatedState.viewDate = this.state.viewDate.clone().utc();}
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      } else {
        if (this.state.viewDate)
        {updatedState.viewDate = this.state.viewDate.clone().local();}
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      }
    }

    this.setState(updatedState);
  }

  getStateFromProps = (props) => {
    let formats = this.getFormats(props);
    let date = props.value || props.defaultValue;
    let selectedDate;
    let viewDate;
    let updateOn;
    let inputValue;

    if (date && typeof date === 'string')
    {selectedDate = this.localMoment(date, formats.datetime);}
    else if (date)
    {selectedDate = this.localMoment(date);}

    if (selectedDate && !selectedDate.isValid())
    {selectedDate = null;}

    viewDate = selectedDate
      ? selectedDate.clone().startOf('month')
      : this.localMoment().startOf('month')
    ;

    updateOn = this.getUpdateOn(formats);

    if (selectedDate)
    {inputValue = selectedDate.format(formats.datetime);}
    else if (date.isValid && !date.isValid())
    {inputValue = '';}
    else
    {inputValue = date || '';}

    return {
      updateOn: updateOn,
      inputFormat: formats.datetime,
      viewDate: viewDate,
      selectedDate: selectedDate,
      inputValue: inputValue,
      open: props.open
    };
  };

  getUpdateOn = (formats) => {
    if (formats.date.match(/[lLD]/)) {
      return 'days';
    } else if (formats.date.indexOf('M') !== -1) {
      return 'months';
    } else if (formats.date.indexOf('Y') !== -1) {
      return 'years';
    }

    return 'days';
  };

  getFormats = (props) => {
    let formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    };
    let locale = this.localMoment(props.date, null, props).localeData();

    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    }
    else if (this.getUpdateOn(formats) !== 'days') {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    formats.datetime = formats.date && formats.time
      ? formats.date + ' ' + formats.time
      : formats.date || formats.time
    ;

    return formats;
  }

  onInputChange =(e) => {
    let value = e.target === null ? e : e.target.value;
    let localMoment = this.localMoment(value, this.state.inputFormat);
    let update = { inputValue: value };

    if (localMoment.isValid() && !this.props.value) {
      update.selectedDate = localMoment;
      update.viewDate = localMoment.clone().startOf('month');
    } else {
      update.selectedDate = null;
    }

    return this.setState(update, () => {
      return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
    });
  }

  onInputKey = (e) => {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  }

  showView = (view) => {
    var me = this;
    return () => {
      me.state.currentView !== view && me.props.onViewModeChange(view);
      me.setState({ currentView: view });
    };
  }

  setDate = (type) => {
    let me = this;
    let nextViews = {
      month: 'days',
      year: 'months'
    };
    return (e) => {
      me.setState({
        viewDate: me.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
        currentView: nextViews[type]
      });
      me.props.onViewModeChange(nextViews[type]);
    };
  }

  addTime = (amount, type, toSelected) => {
    return this.updateTime('add', amount, type, toSelected);
  }

  subtractTime = (amount, type, toSelected) => {
    return this.updateTime('subtract', amount, type, toSelected);
  }

  updateTime = (op, amount, type, toSelected) => {
    var me = this;

    return () => {
      let update = {};
      let date = toSelected ? 'selectedDate' : 'viewDate' ;

      update[date] = me.state[date].clone()[op](amount, type);

      me.setState(update);
    };
  }

  setTime = (type, value) => {
    let index = this.allowedSetTime.indexOf(type) + 1;
    let state = this.state;
    let date = (state.selectedDate || state.viewDate).clone();
    let nextType;

    // It is needed to set all the time properties
    // to not to reset the time
    date[type](value);
    for (; index < this.allowedSetTime.length; index++) {
      nextType = this.allowedSetTime[index];
      date[nextType](date[nextType]());
    }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(state.inputFormat)
      });
    }
    this.props.onChange(date);
  }

  updateSelectedDate = (e, close) => {
    let target = e.target;
    let modifier = 0;
    let viewDate = this.state.viewDate;
    let currentDate = this.state.selectedDate || viewDate;
    let date ;

    if (target.className.indexOf('rdtDay') !== -1) {
      if (target.className.indexOf('rdtNew') !== -1)
      {modifier = 1;}
      else if (target.className.indexOf('rdtOld') !== -1)
      {modifier = -1;}

      date = viewDate.clone()
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value'), 10));
    } else if (target.className.indexOf('rdtMonth') !== -1) {
      date = viewDate.clone()
        .month(parseInt(target.getAttribute('data-value'), 10))
        .date(currentDate.date());
    } else if (target.className.indexOf('rdtYear') !== -1) {
      date = viewDate.clone()
        .month(currentDate.month())
        .date(currentDate.date())
        .year(parseInt(target.getAttribute('data-value'), 10));
    }

    date.hours(currentDate.hours())
      .minutes(currentDate.minutes())
      .seconds(currentDate.seconds())
      .milliseconds(currentDate.milliseconds());

    if (!this.props.value) {
      var open = !(this.props.closeOnSelect && close);
      if (!open) {
        this.props.onBlur(date);
      }

      this.setState({
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(this.state.inputFormat),
        open: open
      });
    } else if (this.props.closeOnSelect && close) {
      this.closeCalendar();
    }

    this.props.onChange(date);
  }

  openCalendar = () => {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        this.props.onFocus();
      });
    }
  }

  closeCalendar = () => {
    this.setState({ open: false }, () => {
      this.props.onBlur(this.state.selectedDate || this.state.inputValue);
    });
  }

  handleClickOutside = () => {
    if (this.props.input && this.state.open && !this.props.open) {
      this.setState({ open: false }, () => {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue);
      });
    }
    if (this.props.onClickOutside) {
      this.props.onClickOutside();
    }
  }

  localMoment = (date, format, pro) => {
    let props = pro || this.props;
    var momentFn = props.utc ? moment.utc : moment;
    var m = momentFn(date, format, props.strictParsing);
    if (props.locale)
    {m.locale(props.locale);}
    return m;
  }

  getComponentProps = () => {
    let me = this;
    let formats = this.getFormats(this.props);
    let props = {dateFormat: formats.date, timeFormat: formats.time} ;

    this.componentProps.fromProps.forEach((name) => {
      props[name] = me.props[name];
    });
    this.componentProps.fromState.forEach((name) => {
      props[name] = me.state[name];
    });
    this.componentProps.fromThis.forEach((name) => {
      props[name] = me[name];
    });

    return props;
  }

  render() {
    let className = 'rdt' + (this.props.className && (Array.isArray(this.props.className)
      ? ' ' + this.props.className.join(' ') : ' ' + this.props.className) : '');
    let children = [] ;

    if (this.props.input) {
      children = [React.createElement('input', Object.assign({
        key: 'i',
        type: 'text',
        className: 'form-control',
        onFocus: this.openCalendar,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKey,
        value: this.state.inputValue
      }, this.props.inputProps))];
    } else {
      className += ' rdtStatic';
    }

    if (this.state.open)
    {className += ' rdtOpen';}

    return React.createElement('div', {className: className}, children.concat(
      React.createElement('div',
        { key: 'dt', className: 'rdtPicker' },
        React.createElement(CalendarContainer, {view: this.state.currentView, viewProps: this.getComponentProps(), onClickOutside: this.handleClickOutside })
      )
    ));
  }
}

ReactDatetime.propTypes = {
  // value: TYPES.object | TYPES.string,
  // defaultValue: TYPES.object | TYPES.string,
  value: PropTypes.object,
  dateFormat: PropTypes.bool,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClickOutside: PropTypes.func,
  onChange: PropTypes.func,
  onViewModeChange: PropTypes.func,
  locale: PropTypes.string,
  utc: PropTypes.bool,
  input: PropTypes.bool,
  // dateFormat: PropTypes.string | PropTypes.bool,
  // timeFormat: PropTypes.string | PropTypes.bool,
  inputProps: PropTypes.object,
  timeConstraints: PropTypes.object,
  viewMode: PropTypes.oneOf(['years', 'months', 'days', 'time']),
  isValidDate: PropTypes.func,
  open: PropTypes.bool,
  strictParsing: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  closeOnTab: PropTypes.bool
};
let nof = () => {};
ReactDatetime.defaultProps = {
  className: '',
  defaultValue: '',
  inputProps: {},
  input: true,
  onFocus: nof,
  onBlur: nof,
  onChange: nof,
  onViewModeChange: nof,
  timeFormat: true,
  timeConstraints: {},
  dateFormat: true,
  strictParsing: true,
  closeOnSelect: false,
  closeOnTab: true,
  utc: false
};
// Make moment accessible through the Datetime class
ReactDatetime.moment = moment;
