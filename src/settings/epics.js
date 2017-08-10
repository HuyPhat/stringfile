import { FS_UID } from '../constants';
import { Observable } from 'rxjs/Observable';
import { makeAjaxRequest, handleAjaxResponse } from 'utils/ajax';
import { actions, ENDPOINT } from './constants';
import actionCreators from './actions';

const {
  FETCH_USER_SETTINGS,
  REQUEST_UPDATE_USER_SETTINGS
} = actions;

const {
  fetchUserSettingsFulfilled,
  fetchUserSettingsRejected,
  requestUpdateUserSettingsFulfilled,
  requestUpdateUserSettingsRejected
} = actionCreators;

const fetchUserSettings = action$ =>
  action$.ofType(FETCH_USER_SETTINGS)
    .switchMap(action => {
      return makeAjaxRequest(ENDPOINT.fetchUserSettings.method, ENDPOINT.fetchUserSettings.url(action.payload))
        .flatMap(data => {
          return handleAjaxResponse(data, null, fetchUserSettingsFulfilled, fetchUserSettingsRejected);
        });
    });

const requestUpdateUserSettings = action$ =>
  action$.ofType(REQUEST_UPDATE_USER_SETTINGS)
    .switchMap(action => {
      return makeAjaxRequest(ENDPOINT.updateUserSettings.method, ENDPOINT.updateUserSettings.url(action.payload.uid), action.payload.data)
        .flatMap(data => {
          return handleAjaxResponse(data, null, requestUpdateUserSettingsFulfilled, requestUpdateUserSettingsRejected);
        });
    });

export default [
  fetchUserSettings,
  requestUpdateUserSettings
];
