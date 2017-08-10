import { FS_TOKEN, FS_UID } from '../constants';
import {Observable} from 'rxjs/Observable';
import auth from './authenticator';
import { makeAjaxRequest } from 'utils/ajax';
import {actions, END_POINT} from './constants';
import sessionActions from './actions';

const {
  requestLoginFulfilled,
  requestLoginRejected,
  fetchUserFulfilled,
  fetchUserRejected,
  requestLogoutFulfilled,
  forgotPassword,
  forgotPasswordFulfilled,
  requestLogoutRejected,
  requestSignUpStarter,
  requestSignUpStarterFulfilled,
  requestSignUpStarterRejected
} = sessionActions;

const requestSignInEpic = action$ =>
  action$
    .ofType(actions.REQUEST_LOGIN)
    .filter(action => action.payload.pin.id && action.payload.pin.key)
    .switchMap(action =>
      makeAjaxRequest(END_POINT.login.method, END_POINT.login.url, action.payload)
        .map(data => {
          const {response} = data;
          const {body, meta} = response;
          if (body && body.uid) {
            auth.setAuth(body.access_token, body.uid);
            return requestLoginFulfilled(body);
          } else {
            return requestLoginRejected(meta);
          }
        })
    );

const fetchUserEpic = action$ =>
  action$
    .ofType(actions.FETCH_USER)
    .switchMap(action =>
      makeAjaxRequest(END_POINT.user.method, END_POINT.user.url + '/' + sessionStorage[FS_UID] + '?access_token=' + sessionStorage[FS_TOKEN] + '&email=all&email_status=true&include_team_info=true')
        .map(data => {
          const {response} = data;
          const {body, meta} = response;
          if (body && body.info && body.info.filestring) {
            return fetchUserFulfilled(body.info.filestring);
          } else {
            return fetchUserRejected(meta);
          }
        })
    );

const requestLogoutEpic = action$ =>
  action$.ofType(actions.REQUEST_LOGOUT)
    .switchMap(action =>
      makeAjaxRequest(END_POINT.logout.method, END_POINT.logout.url(sessionStorage.getItem(FS_UID)))
        .map(data => {
          auth.logOut();
          return requestLogoutFulfilled(data.response.body);
        })
    );

const forgotPasswordEpic = action$ =>
  action$.ofType(actions.FORGOT_PASSWORD)
    .switchMap(action =>
      makeAjaxRequest(END_POINT.forgot.method, END_POINT.forgot.url(action.payload.email))
        .map(data => forgotPasswordFulfilled(data.response))
    );

const requestSignUp = action$ =>
  action$.ofType(actions.REQUEST_SIGN_UP_STARTER)
    .switchMap(action => makeAjaxRequest(END_POINT.signupStarter.method, END_POINT.signupStarter.url, action.payload)
      .map(data => {
        const { body, meta } = data.response;
        if (body.connection.status === 1) {
          return requestSignUpStarterFulfilled(body.connection.status);
        }
        else {
          return requestSignUpStarterRejected(body.connection.status);
        }
      })
    );

export default [forgotPasswordEpic, requestLogoutEpic, requestSignInEpic, fetchUserEpic, requestSignUp];
