import { handleActions } from 'redux-actions';
import {
  FETCH_USER_SETTINGS,
  FETCH_USER_SETTINGS_FULFILLED,
  FETCH_USER_SETTINGS_REJECTED,
  REQUEST_UPDATE_USER_SETTINGS,
  REQUEST_UPDATE_USER_SETTINGS_FULFILLED,
  REQUEST_UPDATE_USER_SETTINGS_REJECTED
} from './constants';

const defaultState = {
  settings: {},
  fetching: false,
  error: false,
  meta: {}
};

const userSettingReducer = handleActions({
  FETCH_USER_SETTINGS: (state, action) => ({
    ...state,
    fetching: true
  }),
  FETCH_USER_SETTINGS_FULFILLED: (state, action) => ({
    ...state,
    fetching: false,
    settings: action.payload.body.settings,
    meta: action.payload.meta
  }),
  FETCH_USER_SETTINGS_REJECTED: (state, action) => ({
    ...state,
    fetching: false,
    meta: action.payload.meta
  }),
  REQUEST_UPDATE_USER_SETTINGS: (state, action) => ({
    ...state,
    fetching: true
  }),
  REQUEST_UPDATE_USER_SETTINGS_FULFILLED: (state, action) => ({
    ...state,
    fetching: false,
    meta: action.payload.meta
  }),
  REQUEST_UPDATE_USER_SETTINGS_REJECTED: (state, action) => ({
    ...state,
    fetching: false,
    meta: action.payload.meta
  })
}, defaultState);

export { userSettingReducer };
