import moment from 'moment';
import * as Utils from 'utils/utils';

export const elapsedTime = (v) => {
  if (!v) {
    return 'Never';
  }
  var time = v;
  if (typeof (time) === 'number') {
    // if (time.toString().length <= 10) {
    //   time *= 1000;
    // }
    time = moment.unix(time);
  } else if (typeof (time) === 'string') {
    // TODO: parse time with format
    time = moment(time);
  } else {
    time = moment(time);
  }

  const date = time;
  const currentDate = moment();
  if (currentDate.isBefore(v)) {
    time = date.format('MM/D/YYYY hh:mm A');
  } else if (date.year() === currentDate.year()) { //This year
    if (date.week() === currentDate.week()) { //This week
      if (date.day() === currentDate.day() || moment.duration(currentDate.diff(date)).asHours() <= 13) { //Today or yesterday within 13 hours
        if (date.minute() === currentDate.minute()) {
          time = 'A moment ago';
        } else if (date.hour() === currentDate.hour()) {
          const minute = currentDate.minute() - date.minute();
          if (minute === 1) {
            time = '1 minute ago';
          } else {
            time = minute + ' minutes ago';
          }
        } else {
          time = date.fromNow();
        }
      } else {
        time = date.format('ddd hh:mm A');
      }
    } else {
      time = date.format('MMM D');
    }
  } else {
    time = date.format('MMM D, YYYY');
  }
  return time;
};

export const displayTime = (v) => {
  const time = Math.abs(v);
  if (!time) {
    return '00:00:00';
  }
  var hours = Math.floor(time / 3600);
  var min = Math.floor((time - hours * 3600) / 60);
  var second = time - (hours * 3600 + min * 60);
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return hours + ':' + min + ':' + second;
};

export const sortObjByTime = (a, b, field, isLatestFirst) => {
  let result;
  const tempA = moment(Utils.getValuePath(a, field));
  const tempB = moment(Utils.getValuePath(b, field));
  if (tempA.isBefore(tempB)) {
    result = -1;
  } else if (tempA.isSame(tempB)) {
    result = 0;
  } else {
    result = 1;
  }
  if (!isLatestFirst) {
    result = -result;
  }
  return result;
};
