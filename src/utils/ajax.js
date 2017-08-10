/**
 * Created by huyphat on 05/06/2017.
 */
import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import {Resumablejs, ResumableFile} from './resumable';
import {actions as toastrActions} from 'react-redux-toastr';

import ENV_VARIABLES from 'config/variables';
import { FS_TOKEN } from '../constants';

const getUserAgent = () => {
  let user_agent = window.navigator.userAgent;
  const start_pos = user_agent.indexOf('(');
  const end_pos = user_agent.indexOf(')');
  user_agent = user_agent.substring(start_pos, end_pos + 1);
  const os_array = [
        '/windows nt 10/i': 'Windows 10',
        '/windows nt 6.3/i': 'Windows 8.1',
        '/windows nt 6.2/i': 'Windows 8',
        '/windows nt 6.1/i': 'Windows 7',
        '/windows nt 6.0/i': 'Windows Vista',
        '/windows nt 5.2/i': 'Windows Server 2003/XP x64',
        '/windows nt 5.1/i': 'Windows XP',
        '/windows xp/i': 'Windows XP',
        '/windows nt 5.0/i': 'Windows 2000',
        '/windows me/i': 'Windows ME',
        '/win98/i': 'Windows 98',
        '/win95/i': 'Windows 95',
        '/win16/i': 'Windows 3.11'
  ];
  os_array.forEach((value, regex) => {
    user_agent.replace(regex, value);
  });
  return user_agent;
};

const USER_AGENT = getUserAgent();
export const POST = 'POST';
export const GET = 'GET';

export const makeAjaxRequest = (method = GET, url, payload) => {
  let request_url = url;
  if (sessionStorage[FS_TOKEN]) {
    if (request_url.indexOf('?') !== -1) {
      request_url += '&access_token=' + sessionStorage[FS_TOKEN];
    } else {
      request_url += '?access_token=' + sessionStorage[FS_TOKEN];
    }
  }
  if (method === GET) {
    return ajax({
      method: GET,
      url: `${request_url}`,
      crossDomain: true,
      // withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Agent': `FileString/${ENV_VARIABLES.VERSION} ${USER_AGENT} Web/${ENV_VARIABLES.STAGE}`
      },
      responseType: 'json'
    });
  }
  return ajax({
    method: POST,
    url: `${request_url}`,
    crossDomain: true,
    // withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Agent': `FileString/${ENV_VARIABLES.VERSION} ${USER_AGENT} Web/${ENV_VARIABLES.STAGE}`
    },
    body: payload,
    responseType: 'json'
  });
};

export const createGetRequest = url => {
  return ajax.get(url);
};

export const ajaxGetJSON = url => {
  return ajax.getJSON(url);
};

export const generateUniqueIdentifier = (file, event) => {
  let arr = file.preview.split('/');
  return arr[arr.length - 1];
};

export const guid = () => {
  return s4() + s4() + s4() + s4() + s4();
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
export const evalCondition = (variableName, {...response}, condition) => {
  var responseStr = JSON.stringify(response);
  var newCondition = `var ${variableName} = ${responseStr};
  console.log(${variableName});
    return ${condition};`;
  var func = new Function(newCondition);
  return func();
};
/* eslint-disable */
export const handleAjaxResponse = (data, conditions, fullfilledFunc, rejectedFunc, successMsg, errorMsg) => {
  let response = data.response;

  if (conditions) {
    if (typeof conditions === 'object') { // If type condition is object, the function and message will be attribute
      for (let i in conditions) { // Multi conditions but only one fit 
        if (conditions.hasOwnProperty(i)) { // i is key and condition
          // Condition only accept pass function
          // if we can pass rejected function as params
          if (evalCondition('response', response, i)) {
            if (conditions[i].msg) {
              return Observable.concat(
                Observable.of(toastrActions.add({type: conditions[i].toastrType, message: conditions[i].msg,  options: { showCloseButton: true, removeOnHover: true}})),
                Observable.of(conditions[i].callbackFunc({...response}))
              );
            }
            return Observable.of(conditions[i].callbackFunc({...response}));
          }
        }
      }
    }
    let successRes = successMsg
      ? Observable.concat(
        Observable.of(toastrActions.add({type: 'success', message: successMsg, options: { showCloseButton: true, removeOnHover: true}})),
        Observable.of(fullfilledFunc({...response}))
      )
      : Observable.of(fullfilledFunc({...response}));
    let errorRes = Observable.concat(
        Observable.of(toastrActions.add({type: 'error', message: errorMsg ? errorMsg : result.meta.message, options: { showCloseButton: true, removeOnHover: true} })),
        Observable.of(rejectedFunc({...response})));
    if (evalCondition(condition)) {
      return successRes;
    } else {
      return errorRes;
    }
  }
  let result = data.response;
  let successRes = successMsg
    ? Observable.concat(
      Observable.of(toastrActions.add({type: 'success', message: successMsg, options: { showCloseButton: true, removeOnHover: true}})),
      Observable.of(fullfilledFunc({...response}))
    )
    : Observable.of(fullfilledFunc({...response}));
  let errorRes = Observable.concat(
          Observable.of(toastrActions.add({type: 'error', message: errorMsg ? errorMsg : result.meta.message, options: { showCloseButton: true, removeOnHover: true} })),
          Observable.of(rejectedFunc(...response)));
  if (result.meta && result.meta.code < 400) {
    return successRes;
  }
  return errorRes;
};
/* eslint-enable */
// export const uploadFile = (file) => {
//   let r = new Resumablejs({
//     target: `${ENV_VARIABLES.FILE_SERVER}upload`,
//     generateUniqueIdentifier: generateUniqueIdentifier
//   });
//   let f = new ResumableFile(Object.keys(file).map((key) => {return file[key];})[0]);
//
//   r.addFile(f, null);
//   console.log(r);
//   let callback = Observable.bindCallback((event, args) => {
//     console.log(args);
//   });
//   r.on('catchAll', callback);
//   r.upload();
//   console.log('asdasdasdas');
//   return callback;
// };
